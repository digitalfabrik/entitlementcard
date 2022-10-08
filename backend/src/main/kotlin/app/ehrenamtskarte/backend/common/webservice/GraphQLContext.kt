package app.ehrenamtskarte.backend.common.webservice

import app.ehrenamtskarte.backend.auth.webservice.JwtPayload
import com.expediagroup.graphql.generator.execution.GraphQLContext
import jakarta.servlet.http.Part
import java.io.File

data class GraphQLContext(
    val applicationData: File,
    val jwtPayload: JwtPayload?,
    val files: List<Part>
) : GraphQLContext {
    val isSignedIn get() = jwtPayload != null

    fun enforceSignedIn() {
        if (!isSignedIn) throw UnauthorizedException()
    }
}
