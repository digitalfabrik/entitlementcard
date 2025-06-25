package app.ehrenamtskarte.backend.freinet.webservice
import app.ehrenamtskarte.backend.application.database.repos.ApplicationRepository
import app.ehrenamtskarte.backend.auth.getAdministrator
import app.ehrenamtskarte.backend.auth.service.Authorizer
import app.ehrenamtskarte.backend.common.utils.devWarn
import app.ehrenamtskarte.backend.common.utils.findValueByName
import app.ehrenamtskarte.backend.common.webservice.context
import app.ehrenamtskarte.backend.exception.service.NotFoundException
import app.ehrenamtskarte.backend.exception.service.NotImplementedException
import app.ehrenamtskarte.backend.exception.service.UnauthorizedException
import app.ehrenamtskarte.backend.exception.webservice.exceptions.ApplicationDataIncompleteException
import app.ehrenamtskarte.backend.exception.webservice.exceptions.FreinetFoundMultiplePersonsException
import app.ehrenamtskarte.backend.freinet.database.repos.FreinetAgencyRepository
import app.ehrenamtskarte.backend.freinet.util.FreinetApi
import app.ehrenamtskarte.backend.freinet.webservice.schema.types.FreinetCard
import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import graphql.schema.DataFetchingEnvironment
import org.jetbrains.exposed.sql.transactions.transaction
import org.slf4j.LoggerFactory

@Suppress("unused")
class FreinetApplicationMutationService {
    private val logger = LoggerFactory.getLogger(FreinetApplicationMutationService::class.java)

    @GraphQLDescription("Send application info to Freinet")
    fun sendApplicationDataToFreinet(
        applicationId: Int,
        project: String,
        freinetCards: List<FreinetCard>,
        dfe: DataFetchingEnvironment,
    ): Boolean {
        // TODO also create cards without expirationDate
        val context = dfe.graphQlContext.context
        val admin = context.getAdministrator()
        val projectConfig = context.backendConfiguration.getProjectConfig(
            project,
        )

        if (projectConfig.freinet == null) {
            throw NotImplementedException()
        }

        return transaction {
            val application = ApplicationRepository.findByIds(listOf(applicationId)).firstOrNull()
                ?: throw NotFoundException("Application not found")

            val regionId = application.regionId.value

            if (!Authorizer.mayViewApplicationsInRegion(admin, regionId)) {
                throw UnauthorizedException()
            }

            val freinetAgency = FreinetAgencyRepository.getFreinetAgencyByRegionId(regionId)
                // Freinet is enabled for this region if dataTransferActivated is true
                ?.takeIf { it.dataTransferActivated }
                ?: return@transaction false

            val objectMapper = jacksonObjectMapper()
            val jsonNode = objectMapper.readTree(application.jsonValue)
            val personalDataNode = jsonNode
                .path("value").firstOrNull { it["name"].asText() == "personalData" }

            if (personalDataNode == null) {
                throw ApplicationDataIncompleteException()
            }

            val firstName = personalDataNode.get("value")?.findValueByName("forenames").orEmpty()
            val lastName = personalDataNode.get("value")?.findValueByName("surname").orEmpty()
            val dateOfBirth = personalDataNode.get("value")?.findValueByName("dateOfBirth").orEmpty()

            val freinetApi = FreinetApi(projectConfig.freinet.host, freinetAgency.apiAccessKey, freinetAgency.agencyId)

            val persons = freinetApi.searchPersons(
                firstName,
                lastName,
                dateOfBirth,
            )

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
                        personalDataNode,
                        admin.email,
                    )

                    val userId = createdPerson.data.get("NEW_USERID").intValue()
                    // TODO Fix check condition is always true
                    if (userId != null) {
                        freinetCards.forEach { card ->
                            freinetApi.addCardInformation(userId, card)
                        }
                    }
                }
                persons.size() == 1 -> {
                    print(persons)
                    val userId = persons[0].get("id").intValue()
                    // TODO Fix check condition is always true
                    if (userId != null) {
                        freinetCards.forEach { card ->
                            print(card)
                            freinetApi.addCardInformation(userId, card)
                        }
                    }
                    // TODO: #2143 - Update existing person
                    logger.devWarn("update existing person")
                }
            }

            return@transaction true
        }
    }
}
