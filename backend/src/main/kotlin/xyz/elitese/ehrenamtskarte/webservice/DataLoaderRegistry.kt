package xyz.elitese.ehrenamtskarte.webservice

import org.dataloader.DataLoaderRegistry
import xyz.elitese.ehrenamtskarte.webservice.dataloader.*

fun initializeDataLoaderRegistry(dataLoaderRegistry: DataLoaderRegistry) {
    dataLoaderRegistry.register(CONTACT_LOADER_NAME, batchContactLoader)
    dataLoaderRegistry.register(CATEGORY_LOADER_NAME, batchCategoryLoader)
    dataLoaderRegistry.register(ACCEPTING_STORE_LOADER_NAME, acceptingStoreLoader)
    dataLoaderRegistry.register(PHYSICAL_STORE_LOADER_NAME, physicalStoreLoader)
    dataLoaderRegistry.register(ADDRESS_LOADER_NAME, batchAddressLoader)
}
