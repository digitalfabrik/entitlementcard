package xyz.elitese.ehrenamtskarte.webservice.schema.types

import graphql.schema.DataFetchingEnvironment
import xyz.elitese.ehrenamtskarte.webservice.dataloader.ACCEPTING_STORE_LOADER_NAME


data class PhysicalStore(
        val id: Int,
        val storeId: Int,
        val addressId: Int
) {

    suspend fun physicalStore(dataFetchingEnvironment: DataFetchingEnvironment): PhysicalStore? {
        return dataFetchingEnvironment.getDataLoader<Int, PhysicalStore?>(ACCEPTING_STORE_LOADER_NAME)
                .load(id).join()
    }

}

