package app.ehrenamtskarte.backend.application.webservice

import app.ehrenamtskarte.backend.application.database.repos.ApplicationRepository
import app.ehrenamtskarte.backend.application.webservice.schema.view.ApplicationView
import app.ehrenamtskarte.backend.auth.database.repos.AdministratorsRepository
import app.ehrenamtskarte.backend.auth.service.Authorizer
import app.ehrenamtskarte.backend.common.webservice.GraphQLContext
import app.ehrenamtskarte.backend.common.webservice.UnauthorizedException
import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import graphql.schema.DataFetchingEnvironment

@Suppress("unused")
class EakApplicationQueryService {

    @GraphQLDescription("Queries all applications for a specific region")
    fun getApplications(
        dfe: DataFetchingEnvironment
    ): List<ApplicationView> {
        val regionId = 0
        val context = dfe.getContext<GraphQLContext>()
        val jwtPayload = context.enforceSignedIn()
        val user = AdministratorsRepository.findByIds(listOf(jwtPayload.userId))[0]
        if (!Authorizer.mayViewApplicationsInRegion(user, regionId)) {
            throw UnauthorizedException()
        }

        return ApplicationRepository.getApplications(regionId)
    }
}
