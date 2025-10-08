package app.ehrenamtskarte.backend.graphql.application.multipart

import app.ehrenamtskarte.backend.graphql.shared.substitute
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import org.springframework.context.i18n.LocaleContextHolder
import org.springframework.graphql.MediaTypes.APPLICATION_GRAPHQL_RESPONSE
import org.springframework.graphql.server.WebGraphQlHandler
import org.springframework.graphql.server.WebGraphQlRequest
import org.springframework.http.HttpCookie
import org.springframework.http.MediaType
import org.springframework.http.MediaType.APPLICATION_JSON
import org.springframework.stereotype.Component
import org.springframework.util.AlternativeJdkIdGenerator
import org.springframework.util.IdGenerator
import org.springframework.util.LinkedMultiValueMap
import org.springframework.web.servlet.function.ServerRequest
import org.springframework.web.servlet.function.ServerResponse

/**
 * Custom handler for processing GraphQL multipart requests (file uploads).
 *
 * The handler performs the following steps:
 * 1. Parses all parts of the incoming multipart request.
 * 2. Stores uploaded files in the GraphQL context (under the key `"files"`) so they can be
 *    accessed in resolvers or injected into query/mutation functions using the `@ContextValue` annotation.
 * 3. Inserts the corresponding `fileIndex` into the JSON payload according to each file reference
 *    (e.g. `{"name":"certificate","type":"Attachment","value":{"fileIndex":0}}`).
 * 4. Forwards the reconstructed GraphQL request to the standard [WebGraphQlHandler] for execution.
 *
 * This implementation serves as a compatibility workaround to enable file uploads in GraphQL
 * within Spring Boot applications.
 */
@Component
class MultipartGraphQLHandler(
    private val graphQlHandler: WebGraphQlHandler,
) {
    private val idGenerator: IdGenerator = AlternativeJdkIdGenerator()
    private val mapper = jacksonObjectMapper()

    @Throws(GraphQLMultipartParseException::class)
    fun handleMultipartRequest(serverRequest: ServerRequest): ServerResponse {
        val request = serverRequest.servletRequest()

        // Collect all parts
        val partsMap = request.parts.associateBy { it.name }

        // Parse operations
        val operationsJson = partsMap["operations"]?.inputStream
            ?: throw GraphQLMultipartParseException("Missing 'operations' part")
        val operationsNode = mapper.readTree(operationsJson)

        // Parse file mapping
        val mapJson = partsMap["map"]?.inputStream
            ?: throw GraphQLMultipartParseException("Missing 'map' part")
        val substitutions = mapper.readValue<Map<String, List<String>>>(mapJson)

        // Collect uploaded files
        val files = request.parts.filter { substitutions.containsKey(it.name) }

        // Substitute file references into the GraphQL variables
        substitutions.forEach { (key, paths) ->
            if (key == "operations" || key == "map") {
                throw GraphQLMultipartParseException("Invalid file key: '$key'")
            }

            val fileIndex = files.indexOfFirst { it.name == key }
            if (fileIndex == -1) {
                throw GraphQLMultipartParseException("Part with key '$key' not found")
            }

            paths.forEach { path ->
                operationsNode.substitute(path, fileIndex, mapper)
            }
        }

        // Deserialize the final payload
        val payload: Map<String, Any> = mapper.readValue(mapper.treeAsTokens(operationsNode))

        // Copy cookies to the GraphQL request
        val targetCookies = LinkedMultiValueMap<String, HttpCookie>().apply {
            serverRequest.cookies().values.flatten().forEach { cookie ->
                add(cookie.name, HttpCookie(cookie.name, cookie.value))
            }
        }

        // Create and execute the GraphQL request
        val graphQlRequest = WebGraphQlRequest(
            serverRequest.uri(),
            serverRequest.headers().asHttpHeaders(),
            targetCookies,
            serverRequest.remoteAddress().orElse(null),
            serverRequest.attributes(),
            payload,
            idGenerator.generateId().toString(),
            LocaleContextHolder.getLocale(),
        )

        // Add uploaded files to the GraphQL context
        graphQlRequest.configureExecutionInput { executionInput, _ ->
            executionInput.transform { builder ->
                builder.graphQLContext { ctxBuilder ->
                    ctxBuilder.put("files", files)
                }
            }
        }

        val future = graphQlHandler.handleRequest(graphQlRequest)
            .map { response ->
                ServerResponse.ok()
                    .headers { it.putAll(response.responseHeaders) }
                    .contentType(selectResponseMediaType(serverRequest))
                    .body(response.toMap())
            }
            .toFuture()

        return ServerResponse.async(future)
    }

    companion object {
        private val SUPPORTED_MEDIA_TYPES = listOf(APPLICATION_GRAPHQL_RESPONSE, APPLICATION_JSON)

        private fun selectResponseMediaType(serverRequest: ServerRequest): MediaType =
            serverRequest.headers().accept().firstOrNull { it in SUPPORTED_MEDIA_TYPES }
                ?: APPLICATION_JSON
    }
}

class GraphQLMultipartParseException(message: String, cause: Throwable? = null) :
    RuntimeException(message, cause)
