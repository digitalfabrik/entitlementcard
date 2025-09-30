package app.ehrenamtskarte.backend.graphql.regions

import app.ehrenamtskarte.backend.graphql.GraphQLParams
import com.expediagroup.graphql.generator.SchemaGeneratorConfig

val regionsGraphQlParams = GraphQLParams(
    config = SchemaGeneratorConfig(
        supportedPackages = listOf("app.ehrenamtskarte.backend.graphql.regions.types"),
    ),
    queries = listOf(
        // TopLevelObject(RegionsQueryService()),
    ),
    mutations = listOf(
        // TopLevelObject(RegionsMutationService()),
    ),
)
