package app.ehrenamtskarte.backend.graphql.freinet.util

import app.ehrenamtskarte.backend.graphql.freinet.exceptions.FreinetTransferFailedException
import app.ehrenamtskarte.backend.graphql.freinet.types.CARD_TYPE_GOLD
import app.ehrenamtskarte.backend.graphql.freinet.types.CARD_TYPE_STANDARD
import app.ehrenamtskarte.backend.graphql.freinet.types.FreinetAddress
import app.ehrenamtskarte.backend.graphql.freinet.types.FreinetCardWithUserId
import app.ehrenamtskarte.backend.graphql.freinet.types.FreinetPerson
import app.ehrenamtskarte.backend.graphql.freinet.types.FreinetPersonCreationResultModel
import app.ehrenamtskarte.backend.graphql.freinet.types.FreinetProtocol
import app.ehrenamtskarte.backend.shared.utils.devInfo
import app.ehrenamtskarte.backend.shared.utils.findValueByName
import app.ehrenamtskarte.backend.shared.utils.findValueByNameNode
import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.node.ObjectNode
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import io.ktor.client.HttpClient
import io.ktor.client.request.request
import io.ktor.client.request.setBody
import io.ktor.client.statement.bodyAsText
import io.ktor.http.ContentType
import io.ktor.http.HttpMethod
import io.ktor.http.URLProtocol
import io.ktor.http.contentType
import io.ktor.http.path
import kotlinx.coroutines.runBlocking
import org.slf4j.LoggerFactory
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

class FreinetApi(
    private val httpClient: HttpClient,
    private val host: String,
    private val accessKey: String,
    private val agencyId: Int,
) {
    private val logger = LoggerFactory.getLogger(FreinetApi::class.java)

    fun searchPersons(firstName: String, lastName: String, dateOfBirth: String): JsonNode =
        runBlocking {
            try {
                val response = httpClient.request {
                    url {
                        protocol = URLProtocol.HTTPS
                        this.host = this@FreinetApi.host
                        path("/api/input/v3/personen/suche")
                        parameters.append("vorname", firstName)
                        parameters.append("nachname", lastName)
                        parameters.append("geburtstag", dateOfBirth)
                        parameters.append("accessKey", accessKey)
                        parameters.append("agencyID", agencyId.toString())
                    }
                    method = HttpMethod.Get
                }
                objectMapper.readTree(response.bodyAsText())
            } catch (e: Exception) {
                logger.error("Freinet search person API error", e)
                throw FreinetTransferFailedException()
            }
        }

    private fun buildPersonBody(
        firstName: String,
        lastName: String,
        dateOfBirth: String,
        personalDataNode: JsonNode,
        userEmail: String,
        userId: Int? = null, // Only needed for update
        updateType: String? = null, // Only needed for update
    ): ObjectNode {
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
            user_id = userId,
        )

        val protocolEntry = FreinetProtocol(
            title = if (updateType != null) {
                "Aktualisierung des Nutzers durch Ehrenamtskarte Bayern von $userEmail"
            } else {
                "Erstellung des Nutzers durch Ehrenamtskarte Bayern von $userEmail"
            },
            date = currentDateTime,
        )

        return objectMapper.createObjectNode().apply {
            addFreinetInitInformation(agencyId, accessKey, "personen", updateType)
            set<ObjectNode>("person", objectMapper.valueToTree(person))
            set<ObjectNode>("protokoll", objectMapper.valueToTree(mapOf("1" to protocolEntry)))
        }
    }

    fun createPerson(
        firstName: String,
        lastName: String,
        dateOfBirth: String,
        personalDataNode: JsonNode,
        userEmail: String,
    ): FreinetPersonCreationResultModel {
        val body = buildPersonBody(
            firstName = firstName,
            lastName = lastName,
            dateOfBirth = dateOfBirth,
            personalDataNode = personalDataNode,
            userEmail = userEmail,
        )
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
                val responseBody = response.bodyAsText()
                logger.devInfo("Successfully created person in freinet: $responseBody")
                FreinetPersonCreationResultModel(
                    true,
                    objectMapper.readTree(responseBody),
                )
            } catch (e: Exception) {
                logger.error("Error creating person in freinet", e)
                throw FreinetTransferFailedException()
            }
        }
    }

    fun updatePerson(
        firstName: String,
        lastName: String,
        dateOfBirth: String,
        personalDataNode: JsonNode,
        userEmail: String,
        userId: Int,
    ): FreinetPersonCreationResultModel {
        val body = buildPersonBody(
            firstName = firstName,
            lastName = lastName,
            dateOfBirth = dateOfBirth,
            personalDataNode = personalDataNode,
            userEmail = userEmail,
            userId = userId,
            updateType = "add_replace",
        )
        val requestBody = objectMapper.writeValueAsString(body)

        return runBlocking {
            try {
                val response = httpClient.request {
                    url {
                        protocol = URLProtocol.HTTPS
                        this.host = this@FreinetApi.host
                        path("/api/input/v3/personen/$userId")
                    }
                    method = HttpMethod.Put
                    contentType(ContentType.Application.Json)
                    setBody(requestBody)
                }
                val responseBody = response.bodyAsText()
                logger.devInfo("Successfully updated person in freinet: $responseBody")
                FreinetPersonCreationResultModel(
                    true,
                    objectMapper.readTree(responseBody),
                )
            } catch (e: Exception) {
                logger.error("Error updating person in freinet", e)
                throw FreinetTransferFailedException()
            }
        }
    }

    fun sendCardInformation(card: FreinetCardWithUserId) {
        val color = mapOf(CARD_TYPE_STANDARD to 1, CARD_TYPE_GOLD to 2)[card.cardType]
        val body: ObjectNode = objectMapper.createObjectNode().apply {
            put("karten_farbe", color)
            put("user_id", card.userId)
            put("digital_card", true)
            if (card.cardType == CARD_TYPE_STANDARD && card.expirationDate != null) {
                put("gueltig_bis", card.expirationDate)
            }
            addFreinetInitInformation(agencyId, accessKey, "ehrenamtskarte")
        }
        val requestBody = objectMapper.writeValueAsString(body)

        runBlocking {
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
            } catch (e: Exception) {
                logger.error("Error creating card in freinet", e)
                throw FreinetTransferFailedException()
            }
        }
    }

    private fun ObjectNode.addFreinetInitInformation(
        agencyId: Int,
        accessKey: String,
        moduleName: String,
        updateType: String? = null,
    ) {
        putObject("init").apply {
            put("apiVersion", "3.0")
            put("agencyID", agencyId)
            put("accessKey", accessKey)
            put("modul", moduleName)
            put("author", "TuerAnTuer")
            put("author_mail", "berechtigungskarte@tuerantuer.org")
            if (updateType != null) {
                put("update_type", updateType)
            }
        }
    }

    companion object {
        private val objectMapper by lazy { jacksonObjectMapper() }
    }
}
