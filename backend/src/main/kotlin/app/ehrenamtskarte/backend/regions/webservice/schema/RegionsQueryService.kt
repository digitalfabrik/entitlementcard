package app.ehrenamtskarte.backend.regions.webservice.schema

import app.ehrenamtskarte.backend.regions.database.repos.RegionsRepository
import app.ehrenamtskarte.backend.regions.webservice.schema.types.Region
import com.expediagroup.graphql.annotations.GraphQLDescription
import org.jetbrains.exposed.sql.transactions.transaction

@Suppress("unused")
class RegionsQueryService {

    @GraphQLDescription("Return list of all regions in the given project.")
    fun regionsInProject(project: String): List<Region> = transaction {
        RegionsRepository.findAllInProject(project).map {
            Region(it.id.value, it.prefix, it.name, it.regionIdentifier)
        }
    }

    @GraphQLDescription("Returns regions queried by ids in the given project.")
    fun regionsByIdInProject(project: String, ids: List<Int>): List<Region?> = transaction {
        RegionsRepository.findByIdsInProject(project, ids).map {
            if (it == null) null
            else Region(it.id.value, it.prefix, it.name, it.regionIdentifier)
        }
    }
}
