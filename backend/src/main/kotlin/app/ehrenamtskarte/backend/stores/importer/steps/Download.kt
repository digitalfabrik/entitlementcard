package app.ehrenamtskarte.backend.stores.importer.steps

import app.ehrenamtskarte.backend.stores.importer.ImportMonitor
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

class Download(val monitor: ImportMonitor) : PipelineStep<Unit, List<LbeAcceptingStore>> {

    override fun execute(input: Unit): List<LbeAcceptingStore> {
        try {
            val url = System.getProperty("app.import.xml")

            val client = HttpClient()
            var response: String?
            runBlocking {
                response = client.request<String> {
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
            monitor.addMessage("Unknown exception while downloading data from lbe", e)
            throw e
        }
    }

}
