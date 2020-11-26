package xyz.elitese.ehrenamtskarte.dataloader

import kotlinx.coroutines.runBlocking
import org.dataloader.DataLoader
import xyz.elitese.ehrenamtskarte.schema.types.AcceptingStore
import java.util.concurrent.CompletableFuture

const val ACCEPTING_STORE_LOADER_NAME = "ACCEPTING_STORE_LOADER"

val allStores = listOf(
        AcceptingStore(1, "Store1", 1, 2),
        AcceptingStore(2, "Store2", 1, 3),
        AcceptingStore(3, "Store3", 1, 3)
)

val acceptingStoreLoader = DataLoader<Long, AcceptingStore?> { ids ->
    CompletableFuture.supplyAsync {
        runBlocking {
            ids.map { id -> allStores.find { store -> store.id == id } }
        }
    }
}
