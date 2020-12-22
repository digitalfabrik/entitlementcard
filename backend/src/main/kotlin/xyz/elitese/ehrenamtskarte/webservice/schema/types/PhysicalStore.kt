package xyz.elitese.ehrenamtskarte.webservice.schema.types

import graphql.schema.DataFetchingEnvironment
import xyz.elitese.ehrenamtskarte.webservice.dataloader.ACCEPTING_STORE_LOADER_NAME
import xyz.elitese.ehrenamtskarte.webservice.dataloader.ADDRESS_LOADER_NAME
import java.util.concurrent.CompletableFuture


data class PhysicalStore(
    val id: Int,
    val storeId: Int,
    val addressId: Int
) {

    fun store(dataFetchingEnvironment: DataFetchingEnvironment): CompletableFuture<AcceptingStore> =
        dataFetchingEnvironment.getDataLoader<Int, AcceptingStore?>(ACCEPTING_STORE_LOADER_NAME).load(id)
            .thenApply { it!! }

    fun address(dataFetchingEnvironment: DataFetchingEnvironment): CompletableFuture<Address> =
        dataFetchingEnvironment.getDataLoader<Int, Address?>(ADDRESS_LOADER_NAME).load(id).thenApply { it!! }

}

