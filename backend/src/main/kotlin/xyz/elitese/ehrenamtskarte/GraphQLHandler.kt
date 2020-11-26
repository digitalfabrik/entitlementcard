package xyz.elitese.ehrenamtskarte

import com.expediagroup.graphql.SchemaGeneratorConfig
import com.expediagroup.graphql.TopLevelObject
import com.expediagroup.graphql.toSchema
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import graphql.ExceptionWhileDataFetching
import graphql.ExecutionInput
import graphql.ExecutionResult
import graphql.GraphQL
import initializeDataLoaderRegistry
import org.dataloader.DataLoaderRegistry
import xyz.elitese.ehrenamtskarte.schema.*
import java.io.IOException
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

data class AuthorizedContext(val authorizedUser: User? = null, var guestUUID: String? = null)

class GraphQLHandler {
    companion object {
        private val config = SchemaGeneratorConfig(supportedPackages = listOf("xyz.elitese.ehrenamtskarte.schema"))
        private val queries = listOf(
                TopLevelObject(AcceptingStoreQueryService())
        )

        private val mutations = listOf(
                TopLevelObject(LoginMutationService())
        )

        val graphQLSchema = toSchema(config, queries, mutations)

        val graphQL = GraphQL.newGraphQL(graphQLSchema).build()!!

    }

    private val mapper = jacksonObjectMapper()
    private val dataLoaderRegistry = DataLoaderRegistry()

    init {
        initializeDataLoaderRegistry(this.dataLoaderRegistry)
    }

    /**
     * Get payload from the request.
     */
    private fun getPayload(request: HttpServletRequest): Map<String, Any>? {
        return try {
            val body = if (request.reader.ready()) request.reader.readText() else ""
            mapper.readValue<Map<String, Any>>(body)
        } catch (e: IOException) {
            throw IOException("Unable to parse GraphQL payload.")
        }
    }

    /**
     * Get the variables passed in the request.
     */
    private fun getVariables(payload: Map<String, *>) =
            payload.getOrElse("variables") { emptyMap<String, Any>() } as Map<String, Any>

    /**
     * Find attache user to context (authentication would go here)
     */
    private fun getContext(request: HttpServletRequest): AuthorizedContext {
        val loggedInUser = User(
                email = "fake@site.com",
                firstName = "Someone",
                lastName = "You Don't know",
                universityId = 4
        )
        return AuthorizedContext(loggedInUser)
    }

    /**
     * Get any errors and data from [executionResult].
     */
    private fun getResult(executionResult: ExecutionResult): MutableMap<String, Any> {
        val result = mutableMapOf<String, Any>()

        if (executionResult.errors.isNotEmpty()) {
            // if we encounter duplicate errors while data fetching, only include one copy
            result["errors"] = executionResult.errors.distinctBy {
                if (it is ExceptionWhileDataFetching) {
                    it.exception
                } else {
                    it
                }
            }
        }

        try {
            // if data is null, get data will fail exceptionally
            result["data"] = executionResult.getData<Any>()
        } catch (e: Exception) {}

        return result
    }

    /**
     * Execute a query against schema
     */
    fun handle(request: HttpServletRequest, response: HttpServletResponse) {
        val payload = getPayload(request)
        payload?.let {
            // Execute the query against the schema
            val executionResult = graphQL.executeAsync(
                    ExecutionInput.Builder()
                            .query(payload["query"].toString())
                            .variables(getVariables(payload))
                            .dataLoaderRegistry(dataLoaderRegistry)
                            .context(getContext(request))
            ).get()
            val result = getResult(executionResult)

            // write response as json
            response.setHeader("Content-Type", "application/json")
            response.writer.write(mapper.writeValueAsString(result))
            response.status = 200
        }
        if (payload == null) {
            response.writer.write("Something went wrong.")
            response.status = 400
        }

    }
}
