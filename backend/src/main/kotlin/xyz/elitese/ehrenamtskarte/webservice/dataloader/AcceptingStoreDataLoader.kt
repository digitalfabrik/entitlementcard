package xyz.elitese.ehrenamtskarte.webservice.dataloader

import kotlinx.coroutines.runBlocking
import org.dataloader.DataLoader
import org.jetbrains.exposed.sql.transactions.transaction
import xyz.elitese.ehrenamtskarte.database.repos.AcceptingStoresRepository
import xyz.elitese.ehrenamtskarte.webservice.schema.types.AcceptingStore
import java.util.concurrent.CompletableFuture

const val ACCEPTING_STORE_LOADER_NAME = "ACCEPTING_STORE_LOADER"

val acceptingStoreLoader = DataLoader<Int, AcceptingStore?> { ids ->
    CompletableFuture.supplyAsync {
        runBlocking {
            transaction {
                AcceptingStoresRepository.findByIds(ids).map {
                    AcceptingStore(it.id.value, it.name, it.contactId.value, it.categoryId.value)
                }
            }
        }
    }
}
