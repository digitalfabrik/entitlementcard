package app.ehrenamtskarte.backend.application.webservice

import app.ehrenamtskarte.backend.application.database.repos.EakApplicationRepository
import app.ehrenamtskarte.backend.application.webservice.schema.view.ApplicationView
import app.ehrenamtskarte.backend.auth.database.repos.AdministratorsRepository
import app.ehrenamtskarte.backend.auth.service.Authorizer
import com.expediagroup.graphql.annotations.GraphQLDescription
import app.ehrenamtskarte.backend.common.webservice.GraphQLContext
import app.ehrenamtskarte.backend.common.webservice.UnauthorizedException

@Suppress("unused")
class EakApplicationQueryService {

    @GraphQLDescription("Queries all applications for a specific region")
    fun getApplications(
        context: GraphQLContext, regionId: Int
    ): List<ApplicationView> {
        val jwtPayload = context.enforceSignedIn()
        val user = AdministratorsRepository.findByIds(listOf(jwtPayload.userId))[0]
        if (!Authorizer.mayViewApplicationsInRegion(user, regionId)) {
            throw UnauthorizedException()
        }

        return EakApplicationRepository.getApplications(regionId)
    }
}
