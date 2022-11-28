package app.ehrenamtskarte.backend.regions.webservice.schema

import app.ehrenamtskarte.backend.regions.database.repos.RegionsRepository
import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import org.jetbrains.exposed.sql.transactions.transaction

@Suppress("unused")
class RegionsMutationService {

    @GraphQLDescription("Updates the data privacy policy of a region")
    fun updateDataPrivacy(regionId: Int, dataPrivacyText: String): Boolean {
        transaction {
            val region = RegionsRepository.findRegionById(regionId)
                RegionsRepository.updateDataPolicy(region, dataPrivacyText)
        }
        return true
    }
}
