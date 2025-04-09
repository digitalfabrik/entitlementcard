package app.ehrenamtskarte.backend.regions.webservice

import app.ehrenamtskarte.backend.common.webservice.GraphQLParams
import app.ehrenamtskarte.backend.common.webservice.createRegistryFromNamedDataLoaders
import app.ehrenamtskarte.backend.regions.webservice.dataloader.regionLoader
import app.ehrenamtskarte.backend.regions.webservice.schema.RegionsMutationService
import app.ehrenamtskarte.backend.regions.webservice.schema.RegionsQueryService
import com.expediagroup.graphql.generator.SchemaGeneratorConfig
import com.expediagroup.graphql.generator.TopLevelObject

val regionsGraphQlParams = GraphQLParams(
    config = SchemaGeneratorConfig(
        supportedPackages = listOf("app.ehrenamtskarte.backend.regions.webservice.schema"),
    ),
    dataLoaderRegistry = createRegistryFromNamedDataLoaders(regionLoader),
    queries = listOf(
        TopLevelObject(RegionsQueryService()),
    ),
    mutations = listOf(
        TopLevelObject(RegionsMutationService()),
    ),
)
