package app.ehrenamtskarte.backend.freinet.util

import app.ehrenamtskarte.backend.exception.webservice.exceptions.FreinetApiNotReachableException
import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import io.ktor.client.HttpClient
import io.ktor.client.plugins.ClientRequestException
import io.ktor.client.plugins.HttpRequestRetry
import io.ktor.client.plugins.HttpResponseValidator
import io.ktor.client.request.request
import io.ktor.client.statement.bodyAsText
import io.ktor.client.statement.bodyAsChannel
import io.ktor.utils.io.jvm.javaio.toInputStream
import io.ktor.http.HttpMethod
import io.ktor.http.HttpStatusCode
import io.ktor.http.URLProtocol
import io.ktor.http.path
import kotlinx.coroutines.runBlocking
import org.slf4j.LoggerFactory

class FreinetSearchPersonApi(private val host: String) {
    private val logger = LoggerFactory.getLogger(FreinetSearchPersonApi::class.java)
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

    fun searchPersons(
        firstName: String,
        lastName: String,
        dateOfBirth: String,
        accessKey: String,
        agencyId: Int,
    ): JsonNode {
        return runBlocking {
            try {
                httpClient.request {
                    url {
                        protocol = URLProtocol.HTTP
                        this.host = this@FreinetSearchPersonApi.host
                        path("/api/input/v3/personen/suche")
                        parameters.append("vorname", firstName)
                        parameters.append("nachname", lastName)
                        parameters.append("geburtstag", dateOfBirth)
                        parameters.append("accessKey", accessKey)
                        parameters.append("agencyID", agencyId.toString())
                    }
                    method = HttpMethod.Get
                }.bodyAsChannel().toInputStream().use { objectMapper.readTree(it) }
            } catch (e:Exception) {
                logger.error("FreinetSearchPersonApi error: ${e}")
                throw e
            }
        }
    }
}
