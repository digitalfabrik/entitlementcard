package xyz.elitese.ehrenamtskarte.webservice.dataloader

import org.dataloader.DataLoaderRegistry

fun initializeDataLoaderRegistry(dataLoaderRegistry: DataLoaderRegistry) {
    dataLoaderRegistry.register(CONTACT_LOADER_NAME, batchContactLoader)
    dataLoaderRegistry.register(CATEGORY_LOADER_NAME, batchCategoryLoader)
    dataLoaderRegistry.register(ACCEPTING_STORE_LOADER_NAME, acceptingStoreLoader)
}
