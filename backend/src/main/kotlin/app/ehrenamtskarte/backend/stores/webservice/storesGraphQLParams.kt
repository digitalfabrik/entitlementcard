package app.ehrenamtskarte.backend.stores.webservice

import app.ehrenamtskarte.backend.common.webservice.GraphQLParams
import app.ehrenamtskarte.backend.stores.webservice.dataloader.*
import app.ehrenamtskarte.backend.stores.webservice.schema.AcceptingStoreQueryService
import app.ehrenamtskarte.backend.stores.webservice.schema.CategoriesQueryService
import com.expediagroup.graphql.SchemaGeneratorConfig
import com.expediagroup.graphql.TopLevelObject
import org.dataloader.DataLoaderRegistry


private fun createDataLoaderRegistry(): DataLoaderRegistry {
    val dataLoaderRegistry = DataLoaderRegistry();
    dataLoaderRegistry.register(CONTACT_LOADER_NAME, contactLoader)
    dataLoaderRegistry.register(CATEGORY_LOADER_NAME, categoryLoader)
    dataLoaderRegistry.register(ACCEPTING_STORE_LOADER_NAME, acceptingStoreLoader)
    dataLoaderRegistry.register(PHYSICAL_STORE_LOADER_NAME, physicalStoreLoader)
    dataLoaderRegistry.register(PHYSICAL_STORE_BY_STORE_ID_LOADER_NAME, physicalStoreByStoreIdLoader)
    dataLoaderRegistry.register(ADDRESS_LOADER_NAME, addressLoader)
    return dataLoaderRegistry
}

val storesGraphQlParams = GraphQLParams(
    config = SchemaGeneratorConfig(supportedPackages = listOf("app.ehrenamtskarte.backend.stores.webservice.schema")),
    dataLoaderRegistry = createDataLoaderRegistry(),
    queries = listOf(
        TopLevelObject(AcceptingStoreQueryService()),
        TopLevelObject(CategoriesQueryService())
    )
)
