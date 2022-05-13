package app.ehrenamtskarte.backend.regions.webservice.schema

import app.ehrenamtskarte.backend.common.webservice.DEFAULT_PROJECT
import app.ehrenamtskarte.backend.regions.database.repos.RegionsRepository
import app.ehrenamtskarte.backend.regions.webservice.schema.types.Region
import com.expediagroup.graphql.annotations.GraphQLDescription
import org.jetbrains.exposed.sql.transactions.transaction

@Suppress("unused")
class RegionsQueryService {

    @GraphQLDescription("Return list of all regions.")
    fun regions(project: String = DEFAULT_PROJECT): List<Region> = transaction {
        RegionsRepository.findAll(project).map {
            Region(it.id.value, it.prefix, it.name, it.regionIdentifier)
        }
    }

    @GraphQLDescription("Returns regions queried by ids.")
    fun regionsById(project: String = DEFAULT_PROJECT, ids: List<Int>): List<Region> = transaction {
        RegionsRepository.findByIds(project, ids).map {
            Region(it.id.value, it.prefix, it.name, it.regionIdentifier)
        }
    }
}
