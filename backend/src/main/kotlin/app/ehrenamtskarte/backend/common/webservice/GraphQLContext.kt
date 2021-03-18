package app.ehrenamtskarte.backend.common.webservice

import app.ehrenamtskarte.backend.auth.webservice.JwtPayload
import com.expediagroup.graphql.execution.GraphQLContext
import javax.servlet.http.Part

data class GraphQLContext(
    val jwtPayload: JwtPayload?,
    val files: List<Part>
) : GraphQLContext {
    val isSignedIn get() = jwtPayload != null

    fun enforceSignedIn() {
        if (!isSignedIn) throw UnauthorizedException()
    }
}
