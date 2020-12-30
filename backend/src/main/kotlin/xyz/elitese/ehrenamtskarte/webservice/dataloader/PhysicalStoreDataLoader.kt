package xyz.elitese.ehrenamtskarte.webservice.dataloader

import kotlinx.coroutines.runBlocking
import org.dataloader.DataLoader
import org.jetbrains.exposed.sql.transactions.transaction
import xyz.elitese.ehrenamtskarte.database.repos.PhysicalStoresRepository
import xyz.elitese.ehrenamtskarte.webservice.schema.types.Coordinates
import xyz.elitese.ehrenamtskarte.webservice.schema.types.PhysicalStore
import java.util.concurrent.CompletableFuture

const val PHYSICAL_STORE_LOADER_NAME = "PHYSICAL_STORE_LOADER"

val physicalStoreLoader = DataLoader<Int, PhysicalStore?> { ids ->
    CompletableFuture.supplyAsync {
        runBlocking {
            transaction {
                PhysicalStoresRepository.findByIds(ids).map {
                    if (it == null) null
                    else PhysicalStore(
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
