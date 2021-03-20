package app.ehrenamtskarte.backend.application.webservice

import app.ehrenamtskarte.backend.application.database.repos.EakApplicationRepository
import app.ehrenamtskarte.backend.application.webservice.schema.view.ApplicationView
import com.expediagroup.graphql.annotations.GraphQLDescription
import app.ehrenamtskarte.backend.common.webservice.GraphQLContext

@Suppress("unused")
class EakApplicationQueryService {

    @GraphQLDescription("Queries all applications for a specific region")
    fun getApplications(
        context: GraphQLContext, regionId: Int
    ): List<ApplicationView> {
        context.enforceSignedIn()
        return EakApplicationRepository.getApplications(regionId)
    }
}
