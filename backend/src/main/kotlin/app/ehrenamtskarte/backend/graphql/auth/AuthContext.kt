package app.ehrenamtskarte.backend.graphql.auth

import app.ehrenamtskarte.backend.db.entities.AdministratorEntity
import app.ehrenamtskarte.backend.shared.exceptions.UnauthorizedException
import com.expediagroup.graphql.generator.extensions.get
import graphql.schema.DataFetchingEnvironment
import org.jetbrains.exposed.v1.jdbc.transactions.transaction

/**
 * Context of an authenticated administrator, regardless of whether they are bound to a project.
 * Use [ProjectAuthContext] instead, if an operation depends on the project of the administrator.
 */
data class AuthContext(
    val admin: AdministratorEntity,
) {
    companion object {
        /**
         * Creates an AuthContext from a given JWT payload by fetching the administrator from the database.
         * Returns null if the administrator is not found.
         */
        fun fromJwtPayload(payload: JwtPayload): AuthContext? =
            transaction { AdministratorEntity.findById(payload.adminId) }?.let { AuthContext(it) }
    }
}

/**
 * Returns the context of the authenticated administrator, regardless of whether they are bound to a project.
 * Throws an [UnauthorizedException] if the request is not authenticated.
 */
fun DataFetchingEnvironment.requireAuthContext(): AuthContext =
    graphQlContext.get<AuthContext>() ?: throw UnauthorizedException()
