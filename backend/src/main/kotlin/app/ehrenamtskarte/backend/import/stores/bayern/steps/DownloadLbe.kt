package app.ehrenamtskarte.backend.import.stores.bayern.steps

import app.ehrenamtskarte.backend.import.stores.ImportConfig
import app.ehrenamtskarte.backend.import.stores.PipelineStep
import app.ehrenamtskarte.backend.import.stores.bayern.types.LbeAcceptingStore
import app.ehrenamtskarte.backend.import.stores.bayern.types.LbeData
import io.ktor.client.HttpClient
import io.ktor.client.request.request
import io.ktor.client.statement.bodyAsText
import io.ktor.http.HttpMethod
import kotlinx.coroutines.runBlocking
import org.slf4j.Logger
import tools.jackson.databind.DeserializationFeature
import tools.jackson.dataformat.xml.XmlMapper
import tools.jackson.module.kotlin.kotlinModule

class DownloadLbe(config: ImportConfig, private val logger: Logger, private val httpClient: HttpClient) :
    PipelineStep<Unit, List<LbeAcceptingStore>>(config) {
    override fun execute(input: Unit): List<LbeAcceptingStore> {
        try {
            val url = config.project.importUrl

            val response = runBlocking {
                httpClient.request(url) {
                    method = HttpMethod.Get
                }.bodyAsText()
            }

            val xmlMapper = XmlMapper.builder()
                .addModule(kotlinModule())
                .enable(DeserializationFeature.ACCEPT_EMPTY_STRING_AS_NULL_OBJECT)
                .disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
                .build()
            val lbeData = xmlMapper.readValue(response, LbeData::class.java)

            return lbeData.acceptingStores
        } catch (e: Exception) {
            logger.error("Unknown exception while downloading data from lbe", e)
            throw e
        }
    }
}
