package app.ehrenamtskarte.backend.graphql

import app.ehrenamtskarte.backend.graphql.auth.AuthContext
import app.ehrenamtskarte.backend.graphql.auth.JwtService
import jakarta.servlet.http.HttpServletRequest
import org.springframework.graphql.server.WebGraphQlInterceptor
import org.springframework.graphql.server.WebGraphQlRequest
import org.springframework.graphql.server.WebGraphQlResponse
import org.springframework.stereotype.Component
import org.springframework.web.context.request.RequestContextHolder
import org.springframework.web.context.request.ServletRequestAttributes
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
        val servletRequest = (RequestContextHolder.getRequestAttributes() as? ServletRequestAttributes)?.request
        val jwtPayload = servletRequest?.let { JwtService.verifyRequest(it) }
        val authContext = jwtPayload?.let { AuthContext.fromJwtPayload(it) }

        request.configureExecutionInput { _, builder ->
            builder.graphQLContext { ctx ->
                authContext?.let { ctx.put(AuthContext::class, it) }
                servletRequest?.let { req ->
                    ctx.put("request", req)
                    ctx.put("remoteIp", getIpAddress(req))
                }
            }.build()
        }

        return chain.next(request)
    }

    private fun getIpAddress(request: HttpServletRequest): String {
        val xRealIp = request.getHeader("X-Real-IP")
        val xForwardedFor = request.getHeader("X-Forwarded-For")
        val remoteAddress = request.remoteAddr

        return listOfNotNull(xRealIp, xForwardedFor, remoteAddress).firstOrNull() ?: "unknown"
    }
}
