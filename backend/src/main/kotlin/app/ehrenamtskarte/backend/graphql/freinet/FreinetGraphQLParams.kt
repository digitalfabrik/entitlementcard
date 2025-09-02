package app.ehrenamtskarte.backend.graphql.freinet

import app.ehrenamtskarte.backend.common.webservice.GraphQLParams
import app.ehrenamtskarte.backend.common.webservice.createRegistryFromNamedDataLoaders
import com.expediagroup.graphql.generator.SchemaGeneratorConfig
import com.expediagroup.graphql.generator.TopLevelObject

val freinetGraphQlParams = GraphQLParams(
    config = SchemaGeneratorConfig(
        supportedPackages = listOf("app.ehrenamtskarte.backend.graphql.freinet.schema"),
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
