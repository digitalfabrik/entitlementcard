package app.ehrenamtskarte.backend.stores.webservice

import app.ehrenamtskarte.backend.common.webservice.GraphQLParams
import app.ehrenamtskarte.backend.common.webservice.createRegistryFromNamedDataLoaders
import app.ehrenamtskarte.backend.stores.webservice.dataloader.acceptingStoreLoader
import app.ehrenamtskarte.backend.stores.webservice.dataloader.addressLoader
import app.ehrenamtskarte.backend.stores.webservice.dataloader.categoryLoader
import app.ehrenamtskarte.backend.stores.webservice.dataloader.contactLoader
import app.ehrenamtskarte.backend.stores.webservice.dataloader.physicalStoreByStoreIdLoader
import app.ehrenamtskarte.backend.stores.webservice.dataloader.physicalStoreLoader
import app.ehrenamtskarte.backend.stores.webservice.schema.AcceptingStoreQueryService
import app.ehrenamtskarte.backend.stores.webservice.schema.CategoriesQueryService
import com.expediagroup.graphql.generator.SchemaGeneratorConfig
import com.expediagroup.graphql.generator.TopLevelObject

val storesGraphQlParams = GraphQLParams(
    config = SchemaGeneratorConfig(
        supportedPackages = listOf("app.ehrenamtskarte.backend.stores.webservice.schema"),
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
