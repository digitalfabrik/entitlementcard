package app.ehrenamtskarte.backend.stores.webservice.schema.types

import app.ehrenamtskarte.backend.stores.webservice.dataloader.ACCEPTING_STORE_LOADER_NAME
import app.ehrenamtskarte.backend.stores.webservice.dataloader.ADDRESS_LOADER_NAME
import graphql.schema.DataFetchingEnvironment
import java.util.concurrent.CompletableFuture


data class PhysicalStore(
    val id: Int,
    val storeId: Int,
    val addressId: Int,
    val coordinates: Coordinates
) {

    fun store(dataFetchingEnvironment: DataFetchingEnvironment): CompletableFuture<AcceptingStore> =
        dataFetchingEnvironment.getDataLoader<Int, AcceptingStore?>(ACCEPTING_STORE_LOADER_NAME).load(storeId)
            .thenApply { it!! }

    fun address(dataFetchingEnvironment: DataFetchingEnvironment): CompletableFuture<Address> =
        dataFetchingEnvironment.getDataLoader<Int, Address?>(ADDRESS_LOADER_NAME).load(addressId).thenApply { it!! }

}

