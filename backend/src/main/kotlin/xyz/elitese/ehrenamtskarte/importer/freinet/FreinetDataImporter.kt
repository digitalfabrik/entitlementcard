package xyz.elitese.ehrenamtskarte.importer.freinet

import io.ktor.client.HttpClient
import io.ktor.client.request.request
import io.ktor.client.request.url
import io.ktor.http.HttpMethod
import kotlinx.coroutines.runBlocking

class FreinetDataImporter {
    fun importAll() {
        val url = FreinetDataImporter::class.java.getResource("/freinet_import/secrets/import_all.txt").readText()
        val client = HttpClient()
        var response: String?
        runBlocking {
            response = client.request<String> {
                url(url)
                method = HttpMethod.Get
            }
        }
        AcceptingStoresImporter.importFromJsonFile(response!!)
    }
}
