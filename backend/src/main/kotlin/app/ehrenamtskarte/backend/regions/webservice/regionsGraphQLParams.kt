package app.ehrenamtskarte.backend.regions.webservice

import app.ehrenamtskarte.backend.common.webservice.GraphQLParams
import app.ehrenamtskarte.backend.regions.webservice.dataloader.REGION_LOADER_NAME
import app.ehrenamtskarte.backend.regions.webservice.dataloader.regionLoader
import app.ehrenamtskarte.backend.regions.webservice.schema.RegionsMutationService
import app.ehrenamtskarte.backend.regions.webservice.schema.RegionsQueryService
import com.expediagroup.graphql.generator.SchemaGeneratorConfig
import com.expediagroup.graphql.generator.TopLevelObject
import org.dataloader.DataLoaderRegistry

private fun createDataLoaderRegistry(): DataLoaderRegistry {
    val dataLoaderRegistry = DataLoaderRegistry()
    dataLoaderRegistry.register(REGION_LOADER_NAME, regionLoader)
    return dataLoaderRegistry
}

val regionsGraphQlParams = GraphQLParams(
    config = SchemaGeneratorConfig(supportedPackages = listOf("app.ehrenamtskarte.backend.regions.webservice.schema")),
    dataLoaderRegistry = createDataLoaderRegistry(),
    queries = listOf(
        TopLevelObject(RegionsQueryService())
    ) ,
    mutations = listOf(
        TopLevelObject(RegionsMutationService())
    )
)
