package app.ehrenamtskarte.backend.application.webservice

import app.ehrenamtskarte.backend.application.database.repos.ApplicationRepository
import app.ehrenamtskarte.backend.application.webservice.schema.view.ApplicationView
import app.ehrenamtskarte.backend.auth.database.AdministratorEntity
import app.ehrenamtskarte.backend.auth.service.Authorizer
import app.ehrenamtskarte.backend.common.webservice.GraphQLContext
import app.ehrenamtskarte.backend.common.webservice.UnauthorizedException
import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import graphql.schema.DataFetchingEnvironment
import org.jetbrains.exposed.sql.transactions.transaction

@Suppress("unused")
class EakApplicationQueryService {

    @GraphQLDescription("Queries all applications for a specific region")
    fun getApplications(
        dfe: DataFetchingEnvironment,
        regionId: Int
    ): List<ApplicationView> {
        val context = dfe.getContext<GraphQLContext>()
        val jwtPayload = context.enforceSignedIn()
        return transaction {
            val user = AdministratorEntity.findById(jwtPayload.adminId)
                ?: throw IllegalArgumentException("Admin does not exist")
            if (!Authorizer.mayViewApplicationsInRegion(user, regionId)) {
                throw UnauthorizedException()
            }

            ApplicationRepository.getApplications(regionId)
        }
    }
}
