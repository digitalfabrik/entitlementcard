package app.ehrenamtskarte.backend.graphql.freinet.util

import app.ehrenamtskarte.backend.graphql.shared.EAK_BAYERN_PROJECT
import app.ehrenamtskarte.backend.config.ProjectConfig
import app.ehrenamtskarte.backend.exception.service.NotFoundException
import app.ehrenamtskarte.backend.graphql.freinet.schema.types.FreinetApiAgency
import app.ehrenamtskarte.backend.graphql.freinet.schema.types.XMLAgencies
import com.fasterxml.jackson.databind.DeserializationFeature
import com.fasterxml.jackson.dataformat.xml.XmlMapper
import com.fasterxml.jackson.module.kotlin.KotlinModule
import io.ktor.client.HttpClient
import io.ktor.client.plugins.HttpRequestRetry
import io.ktor.client.plugins.HttpResponseValidator
import io.ktor.client.request.request
import io.ktor.client.statement.bodyAsText
import io.ktor.http.HttpMethod
import io.ktor.http.HttpStatusCode
import io.ktor.http.URLProtocol
import io.ktor.http.path
import kotlinx.coroutines.runBlocking
import org.slf4j.LoggerFactory

class FreinetAgenciesLoader {
    private val logger = LoggerFactory.getLogger(FreinetAgenciesLoader::class.java)
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

    fun loadAgenciesFromXml(projectConfigs: List<ProjectConfig>): List<FreinetApiAgency> {
        val bayernConfig = projectConfigs
            .find { it.id == EAK_BAYERN_PROJECT }
            ?: throw NotFoundException("Project config not found")
        if (bayernConfig.freinet == null) {
            logger.error("Couldn't find required freinet api parameters in backend config.")
            return emptyList()
        }
        val freinetConfig = bayernConfig.freinet
        try {
            val response = runBlocking {
                httpClient.request {
                    url {
                        protocol = URLProtocol.HTTP
                        host = freinetConfig.host
                        path(freinetConfig.path)
                        parameters.append("accessKey", freinetConfig.accessToken)
                        parameters.append("portalId", freinetConfig.portalId)
                        parameters.append("limit", "1000")
                    }
                    method = HttpMethod.Get
                }.bodyAsText()
            }

            return transformAndFilterAgencyData(
                XmlMapper().apply {
                    registerModule(KotlinModule.Builder().build())
                    enable(DeserializationFeature.ACCEPT_EMPTY_STRING_AS_NULL_OBJECT)
                    disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
                }.readValue(response, XMLAgencies::class.java),
            )
        } catch (e: Exception) {
            logger.error("Couldn't fetch agency information: ", e)
            return emptyList()
        }
    }

    private fun transformAndFilterAgencyData(agencies: XMLAgencies): List<FreinetApiAgency> {
        return agencies.agencies.mapNotNull {
            return@mapNotNull if (it.agencyId != null && it.agencyName != null && it.accessKey != null) {
                FreinetApiAgency(
                    agencyId = it.agencyId.toInt(),
                    agencyName = it.agencyName,
                    apiAccessKey = it.accessKey,
                    officialRegionalKeys = it.officialRegionalKeys?.split(",") ?: emptyList(),
                )
            } else {
                null
            }
        }.distinctBy { it.agencyId }
    }
}
