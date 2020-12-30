package xyz.elitese.ehrenamtskarte.webservice.dataloader

import kotlinx.coroutines.runBlocking
import org.dataloader.DataLoader
import org.jetbrains.exposed.sql.intParam
import org.jetbrains.exposed.sql.transactions.transaction
import xyz.elitese.ehrenamtskarte.database.PhysicalStoreEntity
import xyz.elitese.ehrenamtskarte.database.PhysicalStores
import xyz.elitese.ehrenamtskarte.webservice.schema.types.Coordinates
import xyz.elitese.ehrenamtskarte.webservice.schema.types.PhysicalStore
import java.util.concurrent.CompletableFuture

const val PHYSICAL_STORE_BY_STORE_ID_LOADER_NAME = "PHYSICAL_STORE_BY_STORE_ID_LOADER"

val physicalStoreByStoreIdLoader = DataLoader<Int, PhysicalStore?> { ids ->
    CompletableFuture.supplyAsync {
        runBlocking {
            transaction {
                ids.map { storeId ->
                    PhysicalStoreEntity.find { PhysicalStores.storeId eq intParam(storeId) }
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

