package app.ehrenamtskarte.backend.graphql.shared.context

import app.ehrenamtskarte.backend.graphql.auth.AuthContext
import app.ehrenamtskarte.backend.graphql.auth.JwtService
import com.expediagroup.graphql.generator.annotations.GraphQLIgnore
import jakarta.servlet.http.HttpServletRequest
import org.springframework.graphql.server.WebGraphQlInterceptor
import org.springframework.graphql.server.WebGraphQlRequest
import org.springframework.graphql.server.WebGraphQlResponse
import org.springframework.stereotype.Component
import org.springframework.web.context.request.RequestContextHolder
import org.springframework.web.context.request.ServletRequestAttributes
import reactor.core.publisher.Mono

/**
 * Intercepts all incoming GraphQL requests and enriches the GraphQL context with
 * request-specific metadata, including authentication information and the client's IP address.
 *
 * Example usage:
 * ```
 * val authContext = dfe.graphQlContext.get<AuthContext>() ?: throw UnauthorizedException()
 * ```
 */
@Component
class RequestContextInterceptor : WebGraphQlInterceptor {
    override fun intercept(request: WebGraphQlRequest, chain: WebGraphQlInterceptor.Chain): Mono<WebGraphQlResponse> {
        val servletRequest = (RequestContextHolder.getRequestAttributes() as? ServletRequestAttributes)?.request
        val jwtPayload = JwtService.verifyRequest(servletRequest)
        val authContext = jwtPayload?.let { AuthContext.fromJwtPayload(it) }

        request.configureExecutionInput { _, builder ->
            builder.graphQLContext { ctx ->
                authContext?.let { ctx.put(AuthContext::class, it) }
                servletRequest?.let { ctx.put(RemoteIp::class, RemoteIp(getIpAddress(it))) }
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

@GraphQLIgnore
data class RemoteIp(val value: String) {
    override fun toString(): String = value
}
