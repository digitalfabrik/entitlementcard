package app.ehrenamtskarte.backend.graphql.application.multipart

import app.ehrenamtskarte.backend.graphql.shared.substitute
import com.fasterxml.jackson.core.JsonProcessingException
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import org.slf4j.LoggerFactory
import org.springframework.boot.autoconfigure.condition.ConditionalOnWebApplication
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
 * 5. Handle Multipart request format issues with BadRequest (400) to avoid exception flood.
 *
 * This implementation serves as a compatibility workaround to enable file uploads in GraphQL
 * within Spring Boot applications.
 */
@Component
@ConditionalOnWebApplication(type = ConditionalOnWebApplication.Type.SERVLET)
class MultipartGraphQLHandler(
    private val graphQlHandler: WebGraphQlHandler,
) {
    private val logger = LoggerFactory.getLogger(MultipartGraphQLHandler::class.java)
    private val idGenerator: IdGenerator = AlternativeJdkIdGenerator()
    private val mapper = jacksonObjectMapper()

    fun handleMultipartRequest(serverRequest: ServerRequest): ServerResponse {
        val request = serverRequest.servletRequest()

        // Collect all parts
        val partsMap = request.parts.associateBy { it.name }

        // Validate required parts
        val operationsNode = partsMap["operations"]?.inputStream?.use { mapper.readTree(it) }
            ?: return badRequestResponse("Missing required 'operations' field in multipart request")

        val mapPart = partsMap["map"] ?: return badRequestResponse("Missing required 'map' field in multipart request")
        val mapNode = mapPart.inputStream.use {
            runCatching { mapper.readValue<Map<String, List<String>>>(it) }
                .onFailure { e -> logger.debug("Failed to parse 'map' field in multipart request", e) }
                .getOrNull()
        } ?: return badRequestResponse("Invalid 'map' field format in multipart request")

        // Collect uploaded files
        val files = request.parts.filter { mapNode.containsKey(it.name) }

        // Substitute file references and deserialize payload — client input, so bad format returns 400
        val payload: Map<String, Any> = try {
            mapNode.forEach { (key, paths) ->
                if (key == "operations" || key == "map") {
                    return badRequestResponse("Invalid file key: '$key' - reserved field names")
                }

                val fileIndex = files.indexOfFirst { it.name == key }
                if (fileIndex == -1) {
                    return badRequestResponse("Referenced file '$key' not found in multipart request")
                }

                paths.forEach { path ->
                    operationsNode.substitute(path, fileIndex, mapper)
                }
            }
            mapper.readValue(mapper.treeAsTokens(operationsNode))
        } catch (e: IllegalArgumentException) {
            logger.debug("Failed to process multipart request", e)
            return badRequestResponse("Invalid multipart request format")
        } catch (e: IllegalStateException) {
            logger.debug("Failed to process multipart request", e)
            return badRequestResponse("Invalid multipart request format")
        } catch (e: JsonProcessingException) {
            logger.debug("Failed to process multipart request", e)
            return badRequestResponse("Invalid multipart request format")
        }

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

    private fun badRequestResponse(errorMessage: String): ServerResponse {
        val errorBody = mapOf(
            "errors" to listOf(
                mapOf(
                    "message" to "Invalid GraphQL request format",
                    "extensions" to mapOf(
                        "code" to "INVALID_MULTIPART_REQUEST",
                        "details" to errorMessage,
                    ),
                ),
            ),
        )
        return ServerResponse.badRequest()
            .contentType(APPLICATION_JSON)
            .body(errorBody)
    }

    companion object {
        private val SUPPORTED_MEDIA_TYPES = listOf(APPLICATION_GRAPHQL_RESPONSE, APPLICATION_JSON)

        private fun selectResponseMediaType(serverRequest: ServerRequest): MediaType =
            serverRequest.headers().accept().firstOrNull { it in SUPPORTED_MEDIA_TYPES }
                ?: APPLICATION_JSON
    }
}
