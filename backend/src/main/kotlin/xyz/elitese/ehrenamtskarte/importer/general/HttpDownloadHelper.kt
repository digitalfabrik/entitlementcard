package xyz.elitese.ehrenamtskarte.importer.general

import io.ktor.client.HttpClient
import io.ktor.client.request.request
import io.ktor.client.request.url
import io.ktor.http.HttpMethod
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
