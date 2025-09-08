package app.ehrenamtskarte.backend.shared.webservice

import app.ehrenamtskarte.backend.config.BackendConfiguration
import app.ehrenamtskarte.backend.exception.service.UnauthorizedException
import app.ehrenamtskarte.backend.graphql.auth.JwtPayload
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

fun GraphQLContext.Builder.put(context: app.ehrenamtskarte.backend.shared.webservice.GraphQLContext) {
    put(GraphQLContext::class, context)
}

val GraphQLContext.context: app.ehrenamtskarte.backend.shared.webservice.GraphQLContext
    get() = get(GraphQLContext::class)
