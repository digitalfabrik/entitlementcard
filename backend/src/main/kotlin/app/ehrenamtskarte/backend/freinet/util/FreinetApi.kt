package app.ehrenamtskarte.backend.freinet.util

import app.ehrenamtskarte.backend.common.utils.devInfo
import app.ehrenamtskarte.backend.common.utils.findValueByName
import app.ehrenamtskarte.backend.common.utils.findValueByNameNode
import app.ehrenamtskarte.backend.freinet.exceptions.FreinetApiNotReachableException
import app.ehrenamtskarte.backend.freinet.webservice.schema.types.CARD_TYPE_GOLD
import app.ehrenamtskarte.backend.freinet.webservice.schema.types.CARD_TYPE_STANDARD
import app.ehrenamtskarte.backend.freinet.webservice.schema.types.FreinetAddress
import app.ehrenamtskarte.backend.freinet.webservice.schema.types.FreinetCard
import app.ehrenamtskarte.backend.freinet.webservice.schema.types.FreinetPerson
import app.ehrenamtskarte.backend.freinet.webservice.schema.types.FreinetPersonCreationResultModel
import app.ehrenamtskarte.backend.freinet.webservice.schema.types.FreinetProtocol
import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.node.ObjectNode
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
    ): FreinetPersonCreationResultModel {
        val addressArrayNode = personalDataNode.findValueByNameNode("address")
        val street = addressArrayNode?.findValueByName("street")
        val houseNumber = addressArrayNode?.findValueByName("houseNumber")
        val postalCode = addressArrayNode?.findValueByName("postalCode")
        val location = addressArrayNode?.findValueByName("location")
        val email = personalDataNode.findValueByName("emailAddress")
        val phone = personalDataNode.findValueByName("telephone")

        val currentDateTime = LocalDateTime
            .now()
            .format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))

        val address = FreinetAddress(
            adress_strasse = listOfNotNull(street, houseNumber).joinToString(" ").trim().takeIf { it.isNotBlank() },
            adress_plz = postalCode,
            adress_ort = location,
            adress_mail1 = email,
            adress_tel_p = phone,
        )

        val person = FreinetPerson(
            vorname = firstName,
            nachname = lastName,
            geburtstag = dateOfBirth,
            address = mapOf("1" to address),
        )

        val protocolEntry = FreinetProtocol(
            title = "Erstellung des Nutzers durch Ehrenamtskarte Bayern von $userEmail",
            date = currentDateTime,
        )

        val body: ObjectNode = objectMapper.createObjectNode().apply {
            addFreinetInitInformation(agencyId, accessKey, "personen")
            set<ObjectNode>("person", objectMapper.valueToTree(person))
            set<ObjectNode>("protokoll", objectMapper.valueToTree(mapOf("1" to protocolEntry)))
        }

        val requestBody = objectMapper.writeValueAsString(body)
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
                logger.error("Successfully created person in freinet: ${response.bodyAsText()}")
                FreinetPersonCreationResultModel(
                    true,
                    response.bodyAsChannel().toInputStream().use {
                        objectMapper.readTree(it)
                    },
                )
            } catch (e: Exception) {
                logger.error("Error creating person in freinet $e")
                throw FreinetApiNotReachableException()
            }
        }
    }

    fun sendCardInformation(userId: Int, card: FreinetCard): Boolean {
        val color = mapOf(CARD_TYPE_STANDARD to 1, CARD_TYPE_GOLD to 2)[card.cardType]
        val body: ObjectNode = objectMapper.createObjectNode().apply {
            put("karten_farbe", color)
            put("user_id", userId)
            put("digital_card", true)
            if (card.cardType == CARD_TYPE_STANDARD && card.expirationDate != null) {
                put("gueltig_bis", card.expirationDate)
            }
            addFreinetInitInformation(agencyId, accessKey, "ehrenamtskarte")
        }

        val requestBody = objectMapper.writeValueAsString(body)

        return runBlocking {
            try {
                val response = httpClient.request {
                    url {
                        protocol = URLProtocol.HTTPS
                        this.host = this@FreinetApi.host
                        path("/api/input/v3/ehrenamtskarte")
                    }
                    method = HttpMethod.Post
                    contentType(ContentType.Application.Json)
                    setBody(requestBody)
                }
                logger.devInfo("Successfully created card in freinet: ${response.bodyAsText()}")
                true
            } catch (e: Exception) {
                logger.error("Error creating card in freinet $e")
                throw FreinetApiNotReachableException()
            }
        }
    }

    private fun ObjectNode.addFreinetInitInformation(agencyId: Int, accessKey: String, moduleName: String) {
        putObject("init").apply {
            put("apiVersion", "3.0")
            put("agencyID", agencyId)
            put("accessKey", accessKey)
            put("modul", moduleName)
            put("author", "TuerAnTuer")
            put("author_mail", "berechtigungskarte@tuerantuer.org")
        }
    }
}
