package xyz.elitese.ehrenamtskarte.webservice

import org.dataloader.DataLoaderRegistry
import xyz.elitese.ehrenamtskarte.webservice.dataloader.*

fun initializeDataLoaderRegistry(dataLoaderRegistry: DataLoaderRegistry) {
    dataLoaderRegistry.register(CONTACT_LOADER_NAME, contactLoader)
    dataLoaderRegistry.register(CATEGORY_LOADER_NAME, categoryLoader)
    dataLoaderRegistry.register(ACCEPTING_STORE_LOADER_NAME, acceptingStoreLoader)
    dataLoaderRegistry.register(PHYSICAL_STORE_LOADER_NAME, physicalStoreLoader)
    dataLoaderRegistry.register(PHYSICAL_STORES_LOADER_NAME, physicalStoresLoader)
    dataLoaderRegistry.register(ADDRESS_LOADER_NAME, addressLoader)
}
