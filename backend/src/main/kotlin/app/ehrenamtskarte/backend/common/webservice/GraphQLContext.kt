package app.ehrenamtskarte.backend.common.webservice

import app.ehrenamtskarte.backend.auth.webservice.JwtPayload
import com.expediagroup.graphql.execution.GraphQLContext

data class GraphQLContext(
    val jwtPayload: JwtPayload?
) : GraphQLContext {
    val isSignedIn get() = jwtPayload != null
}
