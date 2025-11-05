package app.ehrenamtskarte.backend.graphql.application.multipart

import app.ehrenamtskarte.backend.graphql.shared.substitute
import com.fasterxml.jackson.core.JsonParser
import com.fasterxml.jackson.core.json.async.NonBlockingByteBufferJsonParser
import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.jacksonTypeRef
import com.fasterxml.jackson.module.kotlin.readValue
import kotlinx.coroutines.reactive.collect
import kotlinx.coroutines.reactor.awaitSingle
import org.springframework.boot.autoconfigure.condition.ConditionalOnWebApplication
import org.springframework.context.i18n.LocaleContextHolder
import org.springframework.core.io.buffer.DataBuffer
import org.springframework.graphql.MediaTypes.APPLICATION_GRAPHQL_RESPONSE
import org.springframework.graphql.server.WebGraphQlHandler
import org.springframework.graphql.server.WebGraphQlRequest
import org.springframework.graphql.server.webflux.GraphQlHttpHandler
import org.springframework.http.HttpCookie
import org.springframework.http.MediaType
import org.springframework.http.MediaType.APPLICATION_JSON
import org.springframework.http.server.reactive.ServerHttpRequest
import org.springframework.stereotype.Component
import org.springframework.util.AlternativeJdkIdGenerator
import org.springframework.util.IdGenerator
import org.springframework.util.LinkedMultiValueMap
import org.springframework.util.MultiValueMap
import org.springframework.web.reactive.function.BodyExtractor
import org.springframework.web.reactive.function.server.ServerRequest
import org.springframework.web.reactive.function.server.ServerResponse
import org.springframework.web.reactive.function.server.support.ServerRequestWrapper
import reactor.core.publisher.Flux

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
@ConditionalOnWebApplication(type = ConditionalOnWebApplication.Type.REACTIVE)
class MultipartGraphQLHandler(
    private val graphQlHandler: GraphQlHttpHandler,
) {
    private val idGenerator: IdGenerator = AlternativeJdkIdGenerator()
    private val mapper = jacksonObjectMapper()
    private val mapStringToStringListType = jacksonTypeRef<Map<String, List<String>>>()

    @Throws(GraphQLMultipartParseException::class)
    suspend fun handleMultipartRequest(serverRequest: ServerRequest): ServerResponse {
        val partsMap = serverRequest.multipartData().awaitSingle()
        val operationsNode = partsMap["operations"]?.first()?.content()?.parse(mapper)
            ?.readValueAsTree<JsonNode>()
            ?: throw GraphQLMultipartParseException("Missing 'operations' node")

        val mapNode = partsMap["map"]?.first()?.content()?.parse(mapper)
            ?.readValueAs<Map<String, List<String>>>(mapStringToStringListType)
            ?: throw GraphQLMultipartParseException("Missing 'map' node")


        // Collect uploaded files
        val files = partsMap
            .filter { (name, _) -> mapNode.containsKey(name) }
            .map { (name, parts) -> parts.first() }

        // Substitute file references into the GraphQL variables
        mapNode.forEach { (key, paths) ->
            if (key == "operations" || key == "map") {
                throw GraphQLMultipartParseException("Invalid file key: '$key'")
            }

            val fileIndex = files.indexOfFirst { it.name() == key }

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

        // val soi = ServerHttpRequest()

        val sr = object : ServerRequestWrapper(serverRequest) {
            override fun cookies(): MultiValueMap<String?, HttpCookie?> = targetCookies
            override fun <T : Any?> body(extractor: BodyExtractor<T?, in ServerHttpRequest>): T & Any {
                return super.body(extractor)
            }

            override fun <T : Any?> body(
                extractor: BodyExtractor<T?, in ServerHttpRequest>,
                hints: Map<String?, Any?>
            ): T & Any {
                return super.body(extractor, hints)
            }
        }


        return graphQlHandler.handleRequest(graphQlRequest)
            .awaitSingle()
            // .let { response ->
            //     ServerResponse.ok()
            //         .headers { it.putAll(response.headers()) }
            //         .contentType(selectResponseMediaType(serverRequest))
            //         .body(response.)
            // }
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


private suspend fun Flux<DataBuffer>.parse(mapper: ObjectMapper): JsonParser =
    (mapper.factory.createNonBlockingByteBufferParser() as NonBlockingByteBufferJsonParser).use { parser ->
        this.collect {
            for (byteBuffer in it.readableByteBuffers()) {
                parser.feedInput(byteBuffer)
            }
        }
        parser.nonBlockingInputFeeder.endOfInput()
        parser
    }
