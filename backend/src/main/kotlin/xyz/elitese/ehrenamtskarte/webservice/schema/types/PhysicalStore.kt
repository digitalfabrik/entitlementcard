package xyz.elitese.ehrenamtskarte.webservice.schema.types

import graphql.schema.DataFetchingEnvironment
import xyz.elitese.ehrenamtskarte.webservice.dataloader.ACCEPTING_STORE_LOADER_NAME
import xyz.elitese.ehrenamtskarte.webservice.dataloader.ADDRESS_LOADER_NAME


data class PhysicalStore(
        val id: Int,
        val storeId: Int,
        val addressId: Int
) {

    suspend fun store(dataFetchingEnvironment: DataFetchingEnvironment): AcceptingStore? {
        return dataFetchingEnvironment.getDataLoader<Int, AcceptingStore?>(ACCEPTING_STORE_LOADER_NAME)
                .load(id).join()
    }

    suspend fun address(dataFetchingEnvironment: DataFetchingEnvironment): Address? {
        return dataFetchingEnvironment.getDataLoader<Int, Address?>(ADDRESS_LOADER_NAME).load(id).join()
    }

}

