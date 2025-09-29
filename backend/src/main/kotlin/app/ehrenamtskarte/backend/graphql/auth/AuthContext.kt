package app.ehrenamtskarte.backend.graphql.auth

import app.ehrenamtskarte.backend.db.entities.AdministratorEntity
import app.ehrenamtskarte.backend.shared.exceptions.UnauthorizedException
import com.expediagroup.graphql.generator.extensions.get
import graphql.schema.DataFetchingEnvironment

data class AuthContext(
    val adminId: Int,
    val admin: AdministratorEntity,
    val projectId: Int,
    val project: String,
)

fun DataFetchingEnvironment.requireAuthContext(): AuthContext =
    graphQlContext.get<AuthContext>() ?: throw UnauthorizedException()
