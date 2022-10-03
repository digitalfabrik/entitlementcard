package app.ehrenamtskarte.backend.common.webservice

import app.ehrenamtskarte.backend.auth.webservice.JwtPayload
import com.expediagroup.graphql.execution.GraphQLContext
import java.io.File
import javax.servlet.http.Part

data class GraphQLContext(
    val applicationData: File,
    val jwtPayload: JwtPayload?,
    val files: List<Part>
) : GraphQLContext {

    fun enforceSignedIn(): JwtPayload {
        val isSignedIn = jwtPayload != null
        if (!isSignedIn) throw UnauthorizedException()
        return jwtPayload!!
    }
}
