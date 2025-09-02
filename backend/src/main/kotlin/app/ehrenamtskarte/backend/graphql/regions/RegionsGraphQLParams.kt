package app.ehrenamtskarte.backend.graphql.regions

import app.ehrenamtskarte.backend.common.webservice.GraphQLParams
import app.ehrenamtskarte.backend.common.webservice.createRegistryFromNamedDataLoaders
import app.ehrenamtskarte.backend.graphql.regions.dataloader.regionLoader
import app.ehrenamtskarte.backend.graphql.regions.schema.RegionsMutationService
import app.ehrenamtskarte.backend.graphql.regions.schema.RegionsQueryService
import com.expediagroup.graphql.generator.SchemaGeneratorConfig
import com.expediagroup.graphql.generator.TopLevelObject

val regionsGraphQlParams = GraphQLParams(
    config = SchemaGeneratorConfig(
        supportedPackages = listOf("app.ehrenamtskarte.backend.graphql.regions.schema"),
    ),
    dataLoaderRegistry = createRegistryFromNamedDataLoaders(regionLoader),
    queries = listOf(
        TopLevelObject(RegionsQueryService()),
    ),
    mutations = listOf(
        TopLevelObject(RegionsMutationService()),
    ),
)
