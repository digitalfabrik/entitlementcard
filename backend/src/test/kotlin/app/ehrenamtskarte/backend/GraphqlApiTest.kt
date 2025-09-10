package app.ehrenamtskarte.backend

import app.ehrenamtskarte.backend.graphql.GraphQLHandler
import app.ehrenamtskarte.backend.helper.GraphqlResponse
import com.expediagroup.graphql.client.types.GraphQLClientRequest
import io.javalin.Javalin
import io.javalin.json.JavalinJackson
import io.javalin.json.toJsonString
import io.javalin.testtools.HttpClient
import java.io.File

open class GraphqlApiTest : IntegrationTest() {
    companion object {
        private val graphQLHandler = GraphQLHandler(config)
    }

    protected val app: Javalin = Javalin.create().apply {
        post("/") { ctx ->
            graphQLHandler.handle(ctx, applicationData = File("dummy"))
        }
    }

    protected fun post(client: HttpClient, mutation: GraphQLClientRequest<*>, token: String? = null): GraphqlResponse {
        val response = client.post("/", JavalinJackson().toJsonString(mutation)) { request ->
            token?.let { request.header("Authorization", "Bearer $it") }
        }
        return GraphqlResponse(response.code, response.body)
    }
}
