package app.ehrenamtskarte.backend.regions.webservice.schema

import app.ehrenamtskarte.backend.regions.database.repos.RegionsRepository
import app.ehrenamtskarte.backend.stores.webservice.schema.types.Region
import com.expediagroup.graphql.annotations.GraphQLDescription
import org.jetbrains.exposed.sql.transactions.transaction

@Suppress("unused")
class RegionsQueryService {

    @GraphQLDescription("Return list of all regions.")
    fun regions(): List<Region> = transaction {
        RegionsRepository.findAll().map {
            Region(it.id.value, it.prefix, it.name, it.regionIdentifier)
        }
    }
}
