package app.ehrenamtskarte.backend.stores.webservice.dataloader

import app.ehrenamtskarte.backend.stores.database.PhysicalStoreEntity
import app.ehrenamtskarte.backend.stores.database.PhysicalStores
import app.ehrenamtskarte.backend.stores.webservice.schema.types.Coordinates
import app.ehrenamtskarte.backend.stores.webservice.schema.types.PhysicalStore
import kotlinx.coroutines.runBlocking
import org.dataloader.DataLoader
import org.dataloader.DataLoaderFactory
import org.jetbrains.exposed.sql.transactions.transaction
import java.util.concurrent.CompletableFuture

const val PHYSICAL_STORE_BY_STORE_ID_LOADER_NAME = "PHYSICAL_STORE_BY_STORE_ID_LOADER"

val physicalStoreByStoreIdLoader: DataLoader<Int, PhysicalStore?> = DataLoaderFactory.newDataLoader { ids ->
    CompletableFuture.supplyAsync {
        runBlocking {
            transaction {
                ids.map { storeId ->
                    PhysicalStoreEntity.find { PhysicalStores.storeId eq storeId }
                        .map {
                            PhysicalStore(
                                it.id.value,
                                it.storeId.value,
                                it.addressId.value,
                                Coordinates(it.coordinates.x, it.coordinates.y)
                            )
                        }
                        .firstOrNull()
                }.toList()
            }
        }
    }
}
