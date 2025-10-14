package app.ehrenamtskarte.backend.graphql.stores.types

import app.ehrenamtskarte.backend.db.entities.PhysicalStoreEntity
import app.ehrenamtskarte.backend.graphql.stores.AcceptingStoreDataLoader
import app.ehrenamtskarte.backend.graphql.stores.AddressDataLoader
import graphql.schema.DataFetchingEnvironment
import org.springframework.graphql.data.method.annotation.SchemaMapping
import org.springframework.stereotype.Controller
import java.util.concurrent.CompletableFuture

data class PhysicalStore(
    val id: Int,
    val storeId: Int,
    val addressId: Int,
    val coordinates: Coordinates,
    // The following fields are resolved by PhysicalStoreResolver
    val store: AcceptingStore? = null,
    val address: Address? = null,
) {
    companion object {
        fun fromDbEntity(entity: PhysicalStoreEntity) =
            PhysicalStore(
                id = entity.id.value,
                storeId = entity.storeId.value,
                addressId = entity.addressId.value,
                coordinates = Coordinates(lng = entity.coordinates.x, lat = entity.coordinates.y),
            )
    }
}

@Controller
class PhysicalStoreResolver {
    @SchemaMapping(typeName = "PhysicalStore", field = "store")
    fun store(physicalStore: PhysicalStore, dfe: DataFetchingEnvironment): CompletableFuture<AcceptingStore> {
        val dataLoader = dfe.getDataLoader<Int, AcceptingStore>(AcceptingStoreDataLoader::class.java.name)
            ?: return CompletableFuture.failedFuture(
                IllegalStateException("AcceptingStoreDataLoader not registered."),
            )
        return dataLoader.load(physicalStore.storeId)
    }

    @SchemaMapping(typeName = "PhysicalStore", field = "address")
    fun address(physicalStore: PhysicalStore, dfe: DataFetchingEnvironment): CompletableFuture<Address> {
        val dataLoader = dfe.getDataLoader<Int, Address>(AddressDataLoader::class.java.name)
            ?: return CompletableFuture.failedFuture(
                IllegalStateException("AddressDataLoader not registered."),
            )
        return dataLoader.load(physicalStore.addressId)
    }
}
