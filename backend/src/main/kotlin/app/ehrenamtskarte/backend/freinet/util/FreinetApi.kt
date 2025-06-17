package app.ehrenamtskarte.backend.freinet.util

import app.ehrenamtskarte.backend.common.utils.devInfo
import app.ehrenamtskarte.backend.common.utils.devWarn
import app.ehrenamtskarte.backend.common.utils.findValueByName
import app.ehrenamtskarte.backend.common.utils.findValueByNameNode
import app.ehrenamtskarte.backend.exception.webservice.exceptions.FreinetApiNotReachableException
import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import io.ktor.client.HttpClient
import io.ktor.client.plugins.HttpRequestRetry
import io.ktor.client.plugins.HttpResponseValidator
import io.ktor.client.request.request
import io.ktor.client.request.setBody
import io.ktor.client.statement.bodyAsChannel
import io.ktor.client.statement.bodyAsText
import io.ktor.http.ContentType
import io.ktor.http.HttpMethod
import io.ktor.http.HttpStatusCode
import io.ktor.http.URLProtocol
import io.ktor.http.contentType
import io.ktor.http.path
import io.ktor.utils.io.jvm.javaio.toInputStream
import kotlinx.coroutines.runBlocking
import org.slf4j.LoggerFactory
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

class FreinetApi(private val host: String, private val accessKey: String, private val agencyId: Int) {
    private val logger = LoggerFactory.getLogger(FreinetApi::class.java)
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

    private val objectMapper = jacksonObjectMapper()

    fun searchPersons(firstName: String, lastName: String, dateOfBirth: String): JsonNode =
        runBlocking {
            try {
                httpClient.request {
                    url {
                        protocol = URLProtocol.HTTP
                        this.host = this@FreinetApi.host
                        path("/api/input/v3/personen/suche")
                        parameters.append("vorname", firstName)
                        parameters.append("nachname", lastName)
                        parameters.append("geburtstag", dateOfBirth)
                        parameters.append("accessKey", accessKey)
                        parameters.append("agencyID", agencyId.toString())
                    }
                    method = HttpMethod.Get
                }.bodyAsChannel().toInputStream().use { objectMapper.readTree(it) }
            } catch (e: Exception) {
                logger.error("Freinet search person API error: $e")
                throw FreinetApiNotReachableException()
            }
        }

    fun createPerson(
        firstName: String,
        lastName: String,
        dateOfBirth: String,
        personalDataNode: JsonNode,
        userEmail: String,
    ): Boolean {
        val addressArrayNode = personalDataNode.get("value").findValueByNameNode("address")
        val street = addressArrayNode?.findValueByName("street")
        val houseNumber = addressArrayNode?.findValueByName("houseNumber")
        val postalCode = addressArrayNode?.findValueByName("postalCode")
        val location = addressArrayNode?.findValueByName("location")
        val email = personalDataNode.get("value").findValueByName("emailAddress")
        val phone = personalDataNode.get("value").findValueByName("telephone")

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
          "geburtstag": "$dateOfBirth",
          "address": {
            "1": {
              "adress_strasse": "$street $houseNumber",
              "adress_plz": "$postalCode",
              "adress_ort": "$location",
              "adress_mail1": "$email",
              "adress_tel_p": "$phone"
            }
          }
        },
        "protokoll": {
          "1": {
            "title": "Erstellung des Nutzers durch Ehrenamtskarte Bayern von $userEmail",
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
                        this.host = this@FreinetApi.host
                        path("/api/input/v3/personen")
                    }
                    method = HttpMethod.Post
                    contentType(ContentType.Application.Json)
                    setBody(requestBody)
                }
                val body = response.bodyAsText()
                logger.devInfo("Successfully created person in freinet: $body")
                true
            } catch (e: Exception) {
                logger.devWarn("Error creating person in freinet $e")
                throw FreinetApiNotReachableException()
            }
        }
    }
}
