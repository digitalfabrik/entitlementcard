package app.ehrenamtskarte.backend.freinet.webservice
import app.ehrenamtskarte.backend.application.database.repos.ApplicationRepository
import app.ehrenamtskarte.backend.auth.getAdministrator
import app.ehrenamtskarte.backend.auth.service.Authorizer
import app.ehrenamtskarte.backend.common.webservice.context
import app.ehrenamtskarte.backend.exception.service.NotFoundException
import app.ehrenamtskarte.backend.exception.service.NotImplementedException
import app.ehrenamtskarte.backend.freinet.database.repos.FreinetAgencyRepository
import app.ehrenamtskarte.backend.freinet.webservice.schema.types.SendToFreinetResponse
import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import com.expediagroup.graphql.generator.annotations.GraphQLIgnore
import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import graphql.schema.DataFetchingEnvironment
import io.ktor.client.HttpClient
import io.ktor.client.plugins.ClientRequestException
import io.ktor.client.plugins.HttpRequestRetry
import io.ktor.client.request.request
import io.ktor.client.statement.bodyAsText
import io.ktor.http.HttpMethod
import io.ktor.http.HttpStatusCode
import io.ktor.http.URLProtocol
import io.ktor.http.path
import kotlinx.coroutines.runBlocking
import kotlinx.serialization.json.Json
import org.jetbrains.exposed.sql.transactions.transaction
import org.slf4j.LoggerFactory
import io.ktor.client.plugins.HttpResponseValidator

@Suppress("unused")
class FreinetSendApplicationData {
    private val logger = LoggerFactory.getLogger(FreinetSendApplicationData::class.java)
    private val httpClient = HttpClient {
        install(HttpRequestRetry) {
            retryOnServerErrors(maxRetries = 3)
            retryOnException(maxRetries = 3, retryOnTimeout = false)
            exponentialDelay()
        }
        HttpResponseValidator {
            validateResponse { response ->
                if (response.status != HttpStatusCode.OK) {
                    throw Exception(response.status.toString())
                }
            }
        }
    }

    private val jsonParser = Json { ignoreUnknownKeys = true }
    val userErrorMessage = "Die Daten konnten nicht mit Freinet-Online synchronisiert werden. Bitte aktualisieren Sie die Daten in Freinet-Online manuell."

    @GraphQLDescription("Send application info to Freinet")
    fun sendApplicationDataToFreinet(
        applicationId: Int,
        project: String,
        @GraphQLIgnore dfe: DataFetchingEnvironment,
    ): SendToFreinetResponse {
        val context = dfe.graphQlContext.context
        val admin = context.getAdministrator()
        val projectConfig = dfe.graphQlContext.context.backendConfiguration.getProjectConfig(
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
                logger.warn("unauthorized access")
                return@transaction SendToFreinetResponse(false, userErrorMessage)
            }

            val freinetAgency = FreinetAgencyRepository.getFreinetAgencyByRegionId(regionId)
                ?: throw NotFoundException("Freinet agency not found for region")

            if (!freinetAgency.dataTransferActivated) {
                logger.info("Freinet is disabled for region $regionId")
                return@transaction SendToFreinetResponse(false ,"disabled for region" )
            }

            try {
                val applicationData = application.jsonValue
                val objectMapper = jacksonObjectMapper()
                val jsonNode = objectMapper.readTree(applicationData)

                val personalDataNode = jsonNode
                    .path("value").firstOrNull { it["name"].asText() == "personalData" }

                fun JsonNode.findValueByName(fieldName: String): String? =
                    this.firstOrNull { it["name"].asText() == fieldName }
                        ?.get("value")
                        ?.asText()

                val firstName = personalDataNode?.get("value")?.findValueByName("forenames").orEmpty()
                val lastName = personalDataNode?.get("value")?.findValueByName("surname").orEmpty()
                val birthDateStr = personalDataNode?.get("value")?.findValueByName("dateOfBirth").orEmpty()

                val responseBody = runBlocking {
                    try {
                    httpClient.request {
                        url {
                            protocol = URLProtocol.HTTP
                            host = projectConfig.freinet.host
                            path("/api/input/v3/personen/suche")
                            parameters.append("vorname", firstName)
                            parameters.append("nachname", lastName)
                            parameters.append("geburtstag", birthDateStr)
                            parameters.append("accessKey", freinetAgency.apiAccessKey)
                            parameters.append("agencyID", freinetAgency.agencyId.toString())
                        }
                        method = HttpMethod.Get
                    }.bodyAsText()
                    } catch (e: ClientRequestException) {
                        val res = e.response
                        val body = res.bodyAsText()
                        logger.warn("Freinet erorr: ${res.status} – body:\n$body")
                        null
                }
                }

                if (responseBody == null) {
                    logger.warn("Freinet rejected the request")
                    return@transaction SendToFreinetResponse(
                        success = false,
                        errorMessage = userErrorMessage
                    )
                }

                val persons = objectMapper.readTree(responseBody)
                when {
                    persons.size() > 1 -> {
                        logger.warn("Multiple persons found in Freinet for $firstName $lastName, born $birthDateStr")
                        return@transaction SendToFreinetResponse(
                            false,
                            "Es wurden mehrere Personen mit diesen Daten gefunden. Bitte aktualisieren Sie die Daten in Freinet-Online manuell.",
                        )
                    }
                    persons.isEmpty() -> {
                        // TODO: #2142 - Create person for Freinet
                        logger.warn("create person for freinet")
                    }
                    persons.size() == 1 -> {
                        // TODO: #2143 - Update existing person
                        logger.warn("update existing person")
                    }
                }

                return@transaction SendToFreinetResponse(true)
            } catch (e: Exception) {
                logger.error("Error while sending data to freinet", e)
                return@transaction SendToFreinetResponse(false, userErrorMessage)
            }
        }
    }
}
