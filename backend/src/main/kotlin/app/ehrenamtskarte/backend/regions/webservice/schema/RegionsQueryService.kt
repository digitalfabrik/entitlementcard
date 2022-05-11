package app.ehrenamtskarte.backend.regions.webservice.schema

import app.ehrenamtskarte.backend.common.webservice.DEFAULT_PROJECT
import app.ehrenamtskarte.backend.common.webservice.schema.IdsParams
import app.ehrenamtskarte.backend.regions.database.repos.RegionsRepository
import app.ehrenamtskarte.backend.regions.webservice.dataloader.REGION_LOADER_NAME
import app.ehrenamtskarte.backend.regions.webservice.schema.types.Region
import com.expediagroup.graphql.annotations.GraphQLDescription
import graphql.schema.DataFetchingEnvironment
import org.jetbrains.exposed.sql.transactions.transaction
import java.util.concurrent.CompletableFuture

@Suppress("unused")
class RegionsQueryService {

    @GraphQLDescription("Return list of all regions.")
    fun regions(project: String = DEFAULT_PROJECT): List<Region> = transaction {
        RegionsRepository.findAll(project).map {
            Region(it.id.value, it.prefix, it.name, it.regionIdentifier)
        }
    }

    @GraphQLDescription("Returns regions queried by ids.")
    fun regionsById(
        params: IdsParams,
        environment: DataFetchingEnvironment
    ): CompletableFuture<List<Region>> =
        environment.getDataLoader<Int, Region>(REGION_LOADER_NAME).loadMany(params.ids)
}
