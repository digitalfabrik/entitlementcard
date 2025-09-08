package app.ehrenamtskarte.backend.graphql.stores

import app.ehrenamtskarte.backend.shared.webservice.GraphQLParams
import app.ehrenamtskarte.backend.shared.webservice.createRegistryFromNamedDataLoaders
import app.ehrenamtskarte.backend.graphql.stores.dataloader.acceptingStoreLoader
import app.ehrenamtskarte.backend.graphql.stores.dataloader.addressLoader
import app.ehrenamtskarte.backend.graphql.stores.dataloader.categoryLoader
import app.ehrenamtskarte.backend.graphql.stores.dataloader.contactLoader
import app.ehrenamtskarte.backend.graphql.stores.dataloader.physicalStoreByStoreIdLoader
import app.ehrenamtskarte.backend.graphql.stores.dataloader.physicalStoreLoader
import app.ehrenamtskarte.backend.graphql.stores.schema.AcceptingStoreQueryService
import app.ehrenamtskarte.backend.graphql.stores.schema.CategoriesQueryService
import com.expediagroup.graphql.generator.SchemaGeneratorConfig
import com.expediagroup.graphql.generator.TopLevelObject

val storesGraphQlParams = GraphQLParams(
    config = SchemaGeneratorConfig(
        supportedPackages = listOf("app.ehrenamtskarte.backend.graphql.stores.schema"),
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
