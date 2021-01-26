package app.ehrenamtskarte.backend.stores.webservice.dataloader

import app.ehrenamtskarte.backend.stores.database.repos.AcceptingStoresRepository
import app.ehrenamtskarte.backend.stores.webservice.schema.types.AcceptingStore
import kotlinx.coroutines.runBlocking
import org.dataloader.DataLoader
import org.jetbrains.exposed.sql.transactions.transaction
import java.util.concurrent.CompletableFuture

const val ACCEPTING_STORE_LOADER_NAME = "ACCEPTING_STORE_LOADER"

val acceptingStoreLoader = DataLoader<Int, AcceptingStore?> { ids ->
    CompletableFuture.supplyAsync {
        runBlocking {
            transaction {
                AcceptingStoresRepository.findByIds(ids).map {
                    if (it == null) null
                    else AcceptingStore(it.id.value, it.name, it.description, it.contactId.value, it.categoryId.value)
                }
            }
        }
    }
}
