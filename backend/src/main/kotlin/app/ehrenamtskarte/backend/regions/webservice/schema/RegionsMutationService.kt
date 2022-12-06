package app.ehrenamtskarte.backend.regions.webservice.schema

import app.ehrenamtskarte.backend.auth.database.AdministratorEntity
import app.ehrenamtskarte.backend.auth.service.Authorizer
import app.ehrenamtskarte.backend.common.webservice.GraphQLContext
import app.ehrenamtskarte.backend.common.webservice.UnauthorizedException
import app.ehrenamtskarte.backend.regions.database.repos.RegionsRepository
import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import graphql.schema.DataFetchingEnvironment
import org.jetbrains.exposed.sql.transactions.transaction

@Suppress("unused")
class RegionsMutationService {

    @GraphQLDescription("Updates the data privacy policy of a region")
    fun updateDataPrivacy(dfe: DataFetchingEnvironment, regionId: Int, dataPrivacyText: String): Boolean {
        val jwtPayload = dfe.getContext<GraphQLContext>().enforceSignedIn()
        transaction {
            val user = AdministratorEntity.findById(jwtPayload.userId) ?: throw UnauthorizedException()
            if (!Authorizer.mayUpdatePrivacyPolicyInRegion(user, regionId)) {
                throw UnauthorizedException()
            }
            val region = RegionsRepository.findRegionById(regionId)
            RegionsRepository.updateDataPolicy(region, dataPrivacyText)
        }
        return true
    }
}
