package app.ehrenamtskarte.backend.stores.webservice

import app.ehrenamtskarte.backend.common.webservice.GraphQLParams
import app.ehrenamtskarte.backend.stores.webservice.dataloader.ACCEPTING_STORE_LOADER_NAME
import app.ehrenamtskarte.backend.stores.webservice.dataloader.ADDRESS_LOADER_NAME
import app.ehrenamtskarte.backend.stores.webservice.dataloader.CATEGORY_LOADER_NAME
import app.ehrenamtskarte.backend.stores.webservice.dataloader.CONTACT_LOADER_NAME
import app.ehrenamtskarte.backend.stores.webservice.dataloader.PHYSICAL_STORE_BY_STORE_ID_LOADER_NAME
import app.ehrenamtskarte.backend.stores.webservice.dataloader.PHYSICAL_STORE_LOADER_NAME
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
import org.dataloader.DataLoaderRegistry

private fun createDataLoaderRegistry(): DataLoaderRegistry {
    val dataLoaderRegistry = DataLoaderRegistry()
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
