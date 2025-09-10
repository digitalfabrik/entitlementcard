package app.ehrenamtskarte.backend.graphql

import app.ehrenamtskarte.backend.config.BackendConfiguration
import app.ehrenamtskarte.backend.graphql.auth.JwtPayload
import app.ehrenamtskarte.backend.shared.exceptions.UnauthorizedException
import graphql.GraphQLContext
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.Part
import java.io.File

data class GraphQLContext(
    val applicationData: File,
    val jwtPayload: JwtPayload?,
    val files: List<Part>,
    val remoteIp: String,
    val backendConfiguration: BackendConfiguration,
    val regionIdentifierByPostalCode: List<Pair<String, String>>,
    val request: HttpServletRequest,
) {
    fun enforceSignedIn(): JwtPayload = jwtPayload ?: throw UnauthorizedException()
}

fun GraphQLContext.Builder.put(context: app.ehrenamtskarte.backend.graphql.GraphQLContext) {
    put(GraphQLContext::class, context)
}

val GraphQLContext.context: app.ehrenamtskarte.backend.graphql.GraphQLContext
    get() = get(GraphQLContext::class)
