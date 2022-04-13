package app.ehrenamtskarte.backend.stores.importer.steps

import app.ehrenamtskarte.backend.config.BackendConfiguration
import app.ehrenamtskarte.backend.stores.importer.PipelineStep
import app.ehrenamtskarte.backend.stores.importer.types.LbeAcceptingStore
import app.ehrenamtskarte.backend.stores.importer.types.LbeData
import com.fasterxml.jackson.databind.DeserializationFeature
import com.fasterxml.jackson.dataformat.xml.XmlMapper
import com.fasterxml.jackson.module.kotlin.KotlinModule
import io.ktor.client.HttpClient
import io.ktor.client.request.request
import io.ktor.client.request.url
import io.ktor.http.HttpMethod
import kotlinx.coroutines.runBlocking
import org.slf4j.Logger

class DownloadLbe(config: BackendConfiguration, private val logger: Logger, private val httpClient: HttpClient) : PipelineStep<Unit, List<LbeAcceptingStore>>(config) {

    override fun execute(input: Unit): List<LbeAcceptingStore> {
        try {
            val url = config.project.importUrl

            val response = runBlocking {
                httpClient.request<String> {
                    url(url)
                    method = HttpMethod.Get
                }
            }

            val xmlMapper = XmlMapper()
            xmlMapper.registerModule(KotlinModule())
            xmlMapper.enable(DeserializationFeature.ACCEPT_EMPTY_STRING_AS_NULL_OBJECT)
            val lbeData = xmlMapper.readValue(response, LbeData::class.java)

            return lbeData.acceptingStores
        } catch (e: Exception) {
            logger.info("Unknown exception while downloading data from lbe", e)
            throw e
        }
    }

}
