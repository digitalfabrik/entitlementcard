package app.ehrenamtskarte.backend.graphql.regions

import app.ehrenamtskarte.backend.graphql.GraphQLParams
import app.ehrenamtskarte.backend.graphql.createRegistryFromNamedDataLoaders
import com.expediagroup.graphql.generator.SchemaGeneratorConfig
import com.expediagroup.graphql.generator.TopLevelObject

val regionsGraphQlParams = GraphQLParams(
    config = SchemaGeneratorConfig(
        supportedPackages = listOf("app.ehrenamtskarte.backend.graphql.regions.types"),
    ),
    dataLoaderRegistry = createRegistryFromNamedDataLoaders(regionLoader),
    queries = listOf(
        TopLevelObject(RegionsQueryService()),
    ),
    mutations = listOf(
        TopLevelObject(RegionsMutationService()),
    ),
)
