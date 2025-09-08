package app.ehrenamtskarte.backend.graphql.stores.schema.types

import app.ehrenamtskarte.backend.graphql.shared.fromEnvironment
import app.ehrenamtskarte.backend.graphql.stores.dataloader.acceptingStoreLoader
import app.ehrenamtskarte.backend.graphql.stores.dataloader.addressLoader
import graphql.schema.DataFetchingEnvironment
import java.util.concurrent.CompletableFuture

data class PhysicalStore(
    val id: Int,
    val storeId: Int,
    val addressId: Int,
    val coordinates: Coordinates,
) {
    fun store(environment: DataFetchingEnvironment): CompletableFuture<AcceptingStore> =
        acceptingStoreLoader.fromEnvironment(environment).load(storeId).thenApply { it!! }

    fun address(environment: DataFetchingEnvironment): CompletableFuture<Address> =
        addressLoader.fromEnvironment(environment).load(addressId).thenApply { it!! }
}
