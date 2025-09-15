package app.ehrenamtskarte.backend.graphql.stores

import app.ehrenamtskarte.backend.graphql.GraphQLParams
import app.ehrenamtskarte.backend.graphql.createRegistryFromNamedDataLoaders
import com.expediagroup.graphql.generator.SchemaGeneratorConfig
import com.expediagroup.graphql.generator.TopLevelObject

val storesGraphQlParams = GraphQLParams(
    config = SchemaGeneratorConfig(
        supportedPackages = listOf("app.ehrenamtskarte.backend.graphql.stores.types"),
    ),
    dataLoaderRegistry = createRegistryFromNamedDataLoaders(
        contactLoader,
        acceptingStoreLoader,
        categoryLoader,
        physicalStoreLoader,
        physicalStoreByStoreIdLoader,
        addressLoader,
    ),
    queries = listOf(
        TopLevelObject(AcceptingStoreQueryService()),
        TopLevelObject(CategoriesQueryService()),
    ),
    mutations = listOf(
        TopLevelObject(AcceptingStoresMutationService()),
    ),
)
