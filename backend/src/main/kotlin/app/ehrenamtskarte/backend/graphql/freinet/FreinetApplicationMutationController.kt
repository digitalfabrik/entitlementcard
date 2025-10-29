package app.ehrenamtskarte.backend.graphql.freinet

import app.ehrenamtskarte.backend.config.BackendConfiguration
import app.ehrenamtskarte.backend.db.entities.ApplicationEntity
import app.ehrenamtskarte.backend.db.entities.ApplicationEntity.Status
import app.ehrenamtskarte.backend.db.entities.mayViewApplicationsInRegion
import app.ehrenamtskarte.backend.db.repositories.FreinetAgencyRepository
import app.ehrenamtskarte.backend.graphql.application.utils.getApplicantDateOfBirth
import app.ehrenamtskarte.backend.graphql.application.utils.getApplicantFirstName
import app.ehrenamtskarte.backend.graphql.application.utils.getApplicantLastName
import app.ehrenamtskarte.backend.graphql.application.utils.getPersonalDataNode
import app.ehrenamtskarte.backend.graphql.auth.requireAuthContext
import app.ehrenamtskarte.backend.graphql.exceptions.InvalidInputException
import app.ehrenamtskarte.backend.graphql.exceptions.NotImplementedException
import app.ehrenamtskarte.backend.graphql.freinet.exceptions.FreinetFoundMultiplePersonsException
import app.ehrenamtskarte.backend.graphql.freinet.exceptions.FreinetPersonDataInvalidException
import app.ehrenamtskarte.backend.graphql.freinet.types.FreinetCard
import app.ehrenamtskarte.backend.graphql.freinet.util.FreinetApi
import app.ehrenamtskarte.backend.shared.exceptions.ForbiddenException
import app.ehrenamtskarte.backend.shared.utils.devWarn
import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import graphql.schema.DataFetchingEnvironment
import org.jetbrains.exposed.sql.transactions.transaction
import org.slf4j.LoggerFactory
import org.springframework.graphql.data.method.annotation.Argument
import org.springframework.graphql.data.method.annotation.MutationMapping
import org.springframework.stereotype.Controller

@Controller
class FreinetApplicationMutationController(
    @Suppress("SpringJavaInjectionPointsAutowiringInspection")
    private val backendConfiguration: BackendConfiguration,
) {
    private val logger = LoggerFactory.getLogger(FreinetApplicationMutationController::class.java)

    @GraphQLDescription("Send application and card information to Freinet")
    @MutationMapping
    fun sendApplicationAndCardDataToFreinet(
        @Argument applicationId: Int,
        @Argument freinetCard: FreinetCard,
        dfe: DataFetchingEnvironment,
    ): Boolean {
        val authContext = dfe.requireAuthContext()
        val projectConfig = backendConfiguration.getProjectConfig(authContext.project)

        if (projectConfig.freinet == null) {
            throw NotImplementedException("Freinet is not configured in this project")
        }

        return transaction {
            val application = ApplicationEntity.findById(applicationId)
                ?: throw InvalidInputException("Application not found")

            if (application.status == Status.Withdrawn) {
                throw InvalidInputException("Application is withdrawn")
            }

            val regionId = application.regionId.value

            if (!authContext.admin.mayViewApplicationsInRegion(regionId)) {
                throw ForbiddenException()
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
