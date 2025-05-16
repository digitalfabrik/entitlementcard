package app.ehrenamtskarte.backend.freinet.util
import app.ehrenamtskarte.backend.exception.webservice.exceptions.RegionNotFoundException
import app.ehrenamtskarte.backend.regions.database.repos.RegionsRepository
import com.fasterxml.jackson.databind.JsonNode
import io.ktor.client.HttpClient
import io.ktor.client.plugins.HttpRequestRetry
import io.ktor.client.plugins.HttpResponseValidator
import io.ktor.client.request.request
import io.ktor.client.request.setBody
import io.ktor.client.statement.bodyAsText
import io.ktor.http.ContentType
import io.ktor.http.HttpMethod
import io.ktor.http.HttpStatusCode
import io.ktor.http.URLProtocol
import io.ktor.http.contentType
import io.ktor.http.path
import kotlinx.coroutines.runBlocking
import org.slf4j.LoggerFactory
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

private val logger = LoggerFactory.getLogger("FreinetPersonCreator")
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
@Suppress("unused")
fun createPersonInFreinet(
    firstName: String,
    lastName: String,
    birthDate: String,
    personalDataNode: JsonNode?,
    userEmail:String,
    agencyId: String,
    accessKey: String,
    host: String,
    project: String,
): Boolean {
    fun JsonNode.findValueByName(fieldName: String): JsonNode? =
            this.firstOrNull { it["name"].asText() == fieldName }
            ?.get("value")

    val addressArrayNode = personalDataNode?.get("value")?.findValueByName("address")
    val street = addressArrayNode?.findValueByName("street")?.asText()
    val postalCode = addressArrayNode?.findValueByName("postalCode")?.asText()
    val regionId = addressArrayNode?.findValueByName("location")?.asText()?.toIntOrNull()?: throw Exception("Failed to get regionId")
    val email = personalDataNode?.get("value")?.findValueByName("emailAddress")?.asText()
    val phone = personalDataNode?.get("value")?.findValueByName("telephone")?.asText()
    val region = RegionsRepository.findByIdInProject(project, regionId)
        ?: throw RegionNotFoundException()


    val currentDateTime = LocalDateTime
        .now()
        .format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))

    val requestBody = """
      {
        "init": {
          "apiVersion": "3.0",
          "agencyID": "$agencyId",
          "accessKey": "$accessKey",
          "modul": "personen", 
          "author": "TuerAnTuer",
          "author_mail": "berechtigungskarte@tuerantuer.org"
        },
        "person": {
          "user_status": "1",
          "vorname": "$firstName",
          "nachname": "$lastName",
          "geburtstag": "$birthDate",
          "address": {
            "1": {
              "adress_strasse": "$street",
              "adress_plz": "$postalCode",
              "adress_ort": "${region.name}",
              "adress_mail1": "$email",
              "adress_tel_p": "$phone"
            }
          }
        },
        "protokoll": {
          "1": {
            "title": "Erstellung des Nutzers durch Ehrenamtskarte Bayern von ${userEmail}",
            "date": "$currentDateTime"
          }
        }
      }
    """.trimIndent()

    return runBlocking {
        try {
            val response = httpClient.request {
                url {
                    protocol = URLProtocol.HTTPS
                    this.host = host
                    path("/api/input/v3/personen")
                }
                method = HttpMethod.Post
                contentType(ContentType.Application.Json)
                setBody(requestBody)
            }
            val body = response.bodyAsText()
            logger.info("Successfully created person in freinet: $body")
            true
        } catch (e: Exception) {
            logger.warn("Error creating person in freinet", e)
            false
        }
    }
}
