package app.ehrenamtskarte.backend.graphql.freinet

import app.ehrenamtskarte.backend.graphql.GraphQLParams
import app.ehrenamtskarte.backend.graphql.createRegistryFromNamedDataLoaders
import com.expediagroup.graphql.generator.SchemaGeneratorConfig
import com.expediagroup.graphql.generator.TopLevelObject

val freinetGraphQlParams = GraphQLParams(
    config = SchemaGeneratorConfig(
        supportedPackages = listOf("app.ehrenamtskarte.backend.graphql.freinet.types"),
    ),
    dataLoaderRegistry = createRegistryFromNamedDataLoaders(),
    queries = listOf(
        TopLevelObject(FreinetAgencyQueryService()),
    ),
    mutations = listOf(
        TopLevelObject(FreinetAgencyMutationService()),
        TopLevelObject(FreinetApplicationMutationService()),
    ),
)
