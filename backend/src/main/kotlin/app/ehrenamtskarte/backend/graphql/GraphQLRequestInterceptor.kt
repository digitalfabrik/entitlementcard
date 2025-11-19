package app.ehrenamtskarte.backend.graphql

import app.ehrenamtskarte.backend.graphql.auth.AuthContext
import app.ehrenamtskarte.backend.graphql.auth.JwtService
import org.springframework.graphql.server.WebGraphQlInterceptor
import org.springframework.graphql.server.WebGraphQlRequest
import org.springframework.graphql.server.WebGraphQlResponse
import org.springframework.stereotype.Component
import reactor.core.publisher.Mono

/**
 * Intercepts all incoming GraphQL requests and enriches the GraphQL context
 * with request-specific metadata such as authentication and HTTP request information.
 *
 * The stored values can be accessed directly via the [graphql.schema.DataFetchingEnvironment]:
 * ```
 * val authContext = dfe.graphQlContext.get<AuthContext>() ?: throw UnauthorizedException()
 * ```
 *
 * Or injected into query or mutation resolvers using the @ContextValue annotation:
 * ```
 * @ContextValue request: HttpServletRequest
 * ```
 */
@Component
class GraphQLRequestInterceptor : WebGraphQlInterceptor {
    override fun intercept(request: WebGraphQlRequest, chain: WebGraphQlInterceptor.Chain): Mono<WebGraphQlResponse> {
        val authContext = request.headers.getFirst("Authorization")
            ?.let { JwtService.verifyRequest(it) }
            ?.let { AuthContext.fromJwtPayload(it) }

        request.configureExecutionInput { _, builder ->
            builder.graphQLContext { ctx ->
                authContext?.let { ctx.put(AuthContext::class, it) }
                ctx.put("request", request)
                ctx.put("remoteIp", getIpAddress(request))
            }.build()
        }

        return chain.next(request)
    }

    private fun getIpAddress(request: WebGraphQlRequest): String =
        request.headers["X-Real-IP"]?.firstOrNull()
            ?: request.headers["X-Forwarded-For"]?.firstOrNull()
            ?: request.remoteAddress.toString()
}
