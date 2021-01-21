package xyz.elitese.ehrenamtskarte.stores.importer.general

import io.ktor.client.*
import io.ktor.client.request.*
import io.ktor.http.*
import kotlinx.coroutines.runBlocking

object HttpDownloadHelper {

    fun downloadData(url: String): String {
        val client = HttpClient()
        var response: String?
        runBlocking {
            response = client.request<String> {
                url(url)
                method = HttpMethod.Get
            }
        }
        return response!!
    }

}
