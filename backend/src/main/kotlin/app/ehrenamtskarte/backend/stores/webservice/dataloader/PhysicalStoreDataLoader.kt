package app.ehrenamtskarte.backend.stores.webservice.dataloader

import app.ehrenamtskarte.backend.common.database.sortByKeys
import app.ehrenamtskarte.backend.stores.database.PhysicalStoreEntity
import app.ehrenamtskarte.backend.stores.database.PhysicalStores
import app.ehrenamtskarte.backend.stores.webservice.schema.types.Coordinates
import app.ehrenamtskarte.backend.stores.webservice.schema.types.PhysicalStore
import kotlinx.coroutines.runBlocking
import org.dataloader.DataLoader
import org.jetbrains.exposed.sql.transactions.transaction
import java.util.concurrent.CompletableFuture

const val PHYSICAL_STORE_LOADER_NAME = "PHYSICAL_STORE_LOADER"

val physicalStoreLoader = DataLoader<Int, PhysicalStore?> { ids ->
    CompletableFuture.supplyAsync {
        runBlocking {
            transaction {
                PhysicalStoreEntity
                    .find { PhysicalStores.id inList ids }
                    .sortByKeys({ it.id.value }, ids)
                    .map {
                        PhysicalStore(
                            it.id.value,
                            it.storeId.value,
                            it.addressId.value,
                            Coordinates(it.coordinates.x, it.coordinates.y)
                        )

                    }
            }
        }
    }
}
