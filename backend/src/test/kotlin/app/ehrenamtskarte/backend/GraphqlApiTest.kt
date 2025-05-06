package app.ehrenamtskarte.backend

import app.ehrenamtskarte.backend.common.webservice.GraphQLHandler
import app.ehrenamtskarte.backend.helper.GraphqlResponse
import app.ehrenamtskarte.backend.userdata.webservice.UserImportHandler
import com.expediagroup.graphql.client.types.GraphQLClientRequest
import io.javalin.Javalin
import io.javalin.json.JavalinJackson
import io.javalin.json.toJsonString
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import org.junit.jupiter.api.AfterAll
import org.junit.jupiter.api.BeforeAll
import java.io.File

open class GraphqlApiTest : IntegrationTest() {
    protected lateinit var app: Javalin

    @BeforeAll
    fun initializeApplication() {
        val graphQLHandler = GraphQLHandler(backendConfiguration)
        val userImportHandler = UserImportHandler(backendConfiguration)
        app = Javalin.create().apply {
            post("/") { ctx ->
                graphQLHandler.handle(ctx, applicationData = File("dummy"))
            }
            post("/users/import") { ctx -> userImportHandler.handle(ctx) }
        }
        app.start(backendConfiguration.server.port.toInt())
    }

    @AfterAll
    fun tearDownApplication() {
        app.stop()
    }

    private var client = OkHttpClient()

    protected fun post(mutation: GraphQLClientRequest<*>, token: String? = null): GraphqlResponse {
        val requestBody = JavalinJackson().toJsonString(mutation)
            .toRequestBody("application/json".toMediaType())

        val requestBuilder = Request.Builder()
            .url("http://localhost:${backendConfiguration.server.port}/")
            .post(requestBody)

        if (token != null) {
            requestBuilder.addHeader("Authorization", "Bearer $token")
        }

        val request = requestBuilder.build()
        val response = client.newCall(request).execute()

        return GraphqlResponse(response.code, response.body)
    }
}
