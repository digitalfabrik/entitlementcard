package app.ehrenamtskarte.backend.graphql.shared.context

import app.ehrenamtskarte.backend.graphql.auth.AuthContext
import app.ehrenamtskarte.backend.graphql.auth.JwtService
import com.expediagroup.graphql.generator.annotations.GraphQLIgnore
import jakarta.servlet.http.HttpServletRequest
import org.springframework.graphql.server.WebGraphQlInterceptor
import org.springframework.graphql.server.WebGraphQlRequest
import org.springframework.graphql.server.WebGraphQlResponse
import org.springframework.stereotype.Component
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
class RequestContextInterceptor(private val request: HttpServletRequest) : WebGraphQlInterceptor {
    override fun intercept(request: WebGraphQlRequest, chain: WebGraphQlInterceptor.Chain): Mono<WebGraphQlResponse> {
        val jwtPayload = JwtService.verifyRequest(request)
        val authContext = jwtPayload?.let { AuthContext.fromJwtPayload(it) }

        request.configureExecutionInput { _, builder ->
            builder.graphQLContext { ctx ->
                authContext?.let { ctx.put(AuthContext::class, it) }
                ctx.put(RemoteIp::class, RemoteIp(getIpAddress()))
            }.build()
        }

        return chain.next(request)
    }

    private fun getIpAddress(): String {
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
