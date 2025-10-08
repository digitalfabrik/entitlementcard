package app.ehrenamtskarte.backend.graphql.auth

import app.ehrenamtskarte.backend.db.entities.AdministratorEntity
import app.ehrenamtskarte.backend.db.entities.Administrators
import app.ehrenamtskarte.backend.db.entities.Projects
import org.jetbrains.exposed.sql.transactions.transaction
import org.springframework.graphql.server.WebGraphQlInterceptor
import org.springframework.graphql.server.WebGraphQlRequest
import org.springframework.graphql.server.WebGraphQlResponse
import org.springframework.stereotype.Component
import org.springframework.web.context.request.RequestContextHolder
import org.springframework.web.context.request.ServletRequestAttributes
import reactor.core.publisher.Mono

/**
 * Spring GraphQL interceptor that extracts authentication information
 * from each incoming GraphQL request and enriches the `GraphQLContext`.
 * If the request does not contain a valid JWT, the context remains unchanged
 * (no `AuthContext` is added)
 *
 * `AuthContext` can be accessed via the DataFetchingEnvironment, e.g.:
 * ```
 * val authContext = dfe.graphQlContext.get<AuthContext>() ?: throw UnauthorizedException()
 * ```
 */
@Component
class AuthInterceptor : WebGraphQlInterceptor {
    override fun intercept(request: WebGraphQlRequest, chain: WebGraphQlInterceptor.Chain): Mono<WebGraphQlResponse> {
        val servletRequest = (RequestContextHolder.getRequestAttributes() as? ServletRequestAttributes)?.request
        val jwtPayload = JwtService.verifyRequest(servletRequest)
        val authContext = jwtPayload?.let {
            transaction {
                (Administrators innerJoin Projects)
                    .select(Administrators.columns + Projects.columns)
                    .where { Administrators.id eq jwtPayload.adminId }
                    .singleOrNull()
                    ?.let {
                        AuthContext(
                            adminId = jwtPayload.adminId,
                            admin = AdministratorEntity.wrapRow(it),
                            projectId = it[Projects.id].value,
                            project = it[Projects.project],
                        )
                    }
            }
        }
        request.configureExecutionInput { _, builder ->
            authContext?.let {
                builder.graphQLContext(mapOf(AuthContext::class to it)).build()
            } ?: builder.build()
        }

        return chain.next(request)
    }
}
