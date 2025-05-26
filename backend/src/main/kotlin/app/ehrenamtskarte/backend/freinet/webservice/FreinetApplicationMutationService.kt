package app.ehrenamtskarte.backend.freinet.webservice
import app.ehrenamtskarte.backend.application.database.repos.ApplicationRepository
import app.ehrenamtskarte.backend.auth.getAdministrator
import app.ehrenamtskarte.backend.auth.service.Authorizer
import app.ehrenamtskarte.backend.common.webservice.context
import app.ehrenamtskarte.backend.common.webservice.findValueByName
import app.ehrenamtskarte.backend.exception.service.NotFoundException
import app.ehrenamtskarte.backend.exception.service.NotImplementedException
import app.ehrenamtskarte.backend.exception.service.UnauthorizedException
import app.ehrenamtskarte.backend.exception.webservice.exceptions.FreinetApiNotReachableException
import app.ehrenamtskarte.backend.exception.webservice.exceptions.FreinetFoundMultiplePersonsException
import app.ehrenamtskarte.backend.freinet.database.repos.FreinetAgencyRepository
import app.ehrenamtskarte.backend.freinet.util.FreinetCreatePersonApi
import app.ehrenamtskarte.backend.freinet.util.FreinetSearchPersonApi
import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import graphql.schema.DataFetchingEnvironment
import org.jetbrains.exposed.sql.transactions.transaction
import org.slf4j.LoggerFactory

@Suppress("unused")
class FreinetApplicationMutationService {
    private val logger = LoggerFactory.getLogger(FreinetApplicationMutationService::class.java)

    @GraphQLDescription("Send application info to Freinet")
    fun sendApplicationDataToFreinet(applicationId: Int, project: String, dfe: DataFetchingEnvironment): Boolean {
        val context = dfe.graphQlContext.context
        val admin = context.getAdministrator()
        val projectConfig = context.backendConfiguration.getProjectConfig(
            project,
        )

        if (projectConfig.freinet == null) {
            throw NotImplementedException()
        }
        val freinetSearchPersonApi = FreinetSearchPersonApi(projectConfig.freinet.host)

        return transaction {
            val application = ApplicationRepository.findByIds(listOf(applicationId)).firstOrNull()
                ?: throw NotFoundException("Application not found")

            val regionId = application.regionId.value

            if (!Authorizer.mayViewApplicationsInRegion(admin, regionId)) {
                logger.warn("unauthorized access")
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

            val firstName = personalDataNode?.get("value")?.findValueByName("forenames").orEmpty()
            val lastName = personalDataNode?.get("value")?.findValueByName("surname").orEmpty()
            val dateOfBirth = personalDataNode?.get("value")?.findValueByName("dateOfBirth").orEmpty()

            val persons = freinetSearchPersonApi.searchPersons(
                firstName = firstName,
                lastName = lastName,
                dateOfBirth = dateOfBirth,
                accessKey = freinetAgency.apiAccessKey,
                agencyId = freinetAgency.agencyId,
            )
            when {
                persons.size() > 1 -> {
                    logger.warn("Multiple persons found in Freinet for $firstName $lastName, born $dateOfBirth")
                    throw FreinetFoundMultiplePersonsException()
                }
                persons.isEmpty() -> {
                    val personCreationResult = FreinetCreatePersonApi(projectConfig.freinet.host).createPerson(
                        firstName,
                        lastName,
                        dateOfBirth,
                        personalDataNode,
                        admin.email,
                        freinetAgency.agencyId.toString(),
                        freinetAgency.apiAccessKey,
                        project,
                    )
                    if (!personCreationResult) {
                        throw FreinetApiNotReachableException()
                    }
                }
                persons.size() == 1 -> {
                    // TODO: #2143 - Update existing person
                    logger.warn("update existing person")
                }
            }

            return@transaction true
        }
    }
}
