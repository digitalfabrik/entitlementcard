package app.ehrenamtskarte.backend.freinet.webservice

import app.ehrenamtskarte.backend.db.entities.ApplicationEntity
import app.ehrenamtskarte.backend.db.entities.ApplicationEntity.Status
import app.ehrenamtskarte.backend.application.webservice.utils.getApplicantDateOfBirth
import app.ehrenamtskarte.backend.application.webservice.utils.getApplicantFirstName
import app.ehrenamtskarte.backend.application.webservice.utils.getApplicantLastName
import app.ehrenamtskarte.backend.application.webservice.utils.getPersonalDataNode
import app.ehrenamtskarte.backend.auth.getAuthContext
import app.ehrenamtskarte.backend.auth.service.Authorizer
import app.ehrenamtskarte.backend.common.utils.devWarn
import app.ehrenamtskarte.backend.common.webservice.context
import app.ehrenamtskarte.backend.exception.service.NotFoundException
import app.ehrenamtskarte.backend.exception.service.NotImplementedException
import app.ehrenamtskarte.backend.exception.service.UnauthorizedException
import app.ehrenamtskarte.backend.exception.webservice.exceptions.InvalidInputException
import app.ehrenamtskarte.backend.db.repositories.FreinetAgencyRepository
import app.ehrenamtskarte.backend.freinet.exceptions.FreinetFoundMultiplePersonsException
import app.ehrenamtskarte.backend.freinet.exceptions.FreinetPersonDataInvalidException
import app.ehrenamtskarte.backend.freinet.util.FreinetApi
import app.ehrenamtskarte.backend.freinet.webservice.schema.types.FreinetCard
import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import graphql.schema.DataFetchingEnvironment
import org.jetbrains.exposed.sql.transactions.transaction
import org.slf4j.LoggerFactory

@Suppress("unused")
class FreinetApplicationMutationService {
    private val logger = LoggerFactory.getLogger(FreinetApplicationMutationService::class.java)

    @GraphQLDescription("Send application and card information to Freinet")
    fun sendApplicationAndCardDataToFreinet(
        applicationId: Int,
        freinetCard: FreinetCard,
        dfe: DataFetchingEnvironment,
    ): Boolean {
        val context = dfe.graphQlContext.context
        val authContext = context.getAuthContext()
        val projectConfig = context.backendConfiguration.getProjectConfig(authContext.project)

        if (projectConfig.freinet == null) {
            throw NotImplementedException()
        }

        return transaction {
            val application = ApplicationEntity.findById(applicationId)
                ?: throw NotFoundException("Application not found")

            if (application.status == Status.Withdrawn) {
                throw InvalidInputException("Application is withdrawn")
            }

            val regionId = application.regionId.value

            if (!Authorizer.mayViewApplicationsInRegion(authContext.admin, regionId)) {
                throw UnauthorizedException()
            }

            val freinetAgency = FreinetAgencyRepository.getFreinetAgencyByRegionId(regionId)
                // Freinet is enabled for this region if dataTransferActivated is true
                ?.takeIf { it.dataTransferActivated }
                ?: return@transaction false

            val firstName = application.getApplicantFirstName()
            val lastName = application.getApplicantLastName()
            val dateOfBirth = application.getApplicantDateOfBirth()

            val freinetApi = FreinetApi(projectConfig.freinet.host, freinetAgency.apiAccessKey, freinetAgency.agencyId)

            val persons = freinetApi.searchPersons(firstName, lastName, dateOfBirth)

            when {
                persons.size() > 1 -> {
                    logger.devWarn("Multiple persons found in Freinet for $firstName $lastName, born $dateOfBirth")
                    throw FreinetFoundMultiplePersonsException()
                }
                persons.isEmpty -> {
                    val createdPerson = freinetApi.createPerson(
                        firstName,
                        lastName,
                        dateOfBirth,
                        application.getPersonalDataNode(),
                        authContext.admin.email,
                    )

                    val userId = createdPerson.data.get("NEW_USERID") ?: throw FreinetPersonDataInvalidException()
                    freinetApi.sendCardInformation(userId.intValue(), freinetCard)
                }
                persons.size() == 1 -> {
                    // TODO: #2143 - Update existing person
                    val userId = persons[0].get("id") ?: throw FreinetPersonDataInvalidException()
                    freinetApi.sendCardInformation(userId.intValue(), freinetCard)

                    logger.devWarn("update existing person and send card data")
                }
            }

            return@transaction true
        }
    }
}
