package app.ehrenamtskarte.backend.stores.webservice

import app.ehrenamtskarte.backend.stores.webservice.dataloader.*
import org.dataloader.DataLoaderRegistry

fun initializeDataLoaderRegistry(dataLoaderRegistry: DataLoaderRegistry) {
    dataLoaderRegistry.register(CONTACT_LOADER_NAME, contactLoader)
    dataLoaderRegistry.register(CATEGORY_LOADER_NAME, categoryLoader)
    dataLoaderRegistry.register(ACCEPTING_STORE_LOADER_NAME, acceptingStoreLoader)
    dataLoaderRegistry.register(PHYSICAL_STORE_LOADER_NAME, physicalStoreLoader)
    dataLoaderRegistry.register(PHYSICAL_STORE_BY_STORE_ID_LOADER_NAME, physicalStoreByStoreIdLoader)
    dataLoaderRegistry.register(ADDRESS_LOADER_NAME, addressLoader)
}
