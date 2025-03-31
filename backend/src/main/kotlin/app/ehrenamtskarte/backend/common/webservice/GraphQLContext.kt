package app.ehrenamtskarte.backend.common.webservice

import app.ehrenamtskarte.backend.auth.webservice.JwtPayload
import app.ehrenamtskarte.backend.config.BackendConfiguration
import app.ehrenamtskarte.backend.exception.service.UnauthorizedException
import com.expediagroup.graphql.generator.execution.GraphQLContext
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
) : GraphQLContext {
    fun enforceSignedIn(): JwtPayload {
        val isSignedIn = jwtPayload != null
        if (!isSignedIn) throw UnauthorizedException()
        return jwtPayload!!
    }
}
