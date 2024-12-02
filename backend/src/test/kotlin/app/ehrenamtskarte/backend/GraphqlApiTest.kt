package app.ehrenamtskarte.backend

import app.ehrenamtskarte.backend.common.webservice.GraphQLHandler
import app.ehrenamtskarte.backend.helper.GraphqlResponse
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import io.javalin.Javalin
import io.javalin.testtools.HttpClient
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import java.io.File

open class GraphqlApiTest : IntegrationTest() {

    protected val app: Javalin = Javalin.create().apply {
        val backendConfiguration = loadTestConfig()
        post("/") { ctx ->
            GraphQLHandler(backendConfiguration).handle(ctx, applicationData = File("dummy"))
        }
    }

    protected fun post(client: HttpClient, mutation: String, token: String? = null): GraphqlResponse {
        val requestBody = jacksonObjectMapper().writeValueAsString(mapOf("query" to mutation))
            .toRequestBody("application/json".toMediaType())

        val requestBuilder = Request.Builder()
            .url(client.origin + "/")
            .post(requestBody)

        if (token != null) {
            requestBuilder.addHeader("Authorization", "Bearer $token")
        }

        val response = client.request(requestBuilder.build())
        return GraphqlResponse(response.code, response.body)
    }
}
