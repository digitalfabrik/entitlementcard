package app.ehrenamtskarte.backend.stores.webservice.dataloader

import app.ehrenamtskarte.backend.common.database.sortByKeys
import app.ehrenamtskarte.backend.stores.database.AcceptingStoreEntity
import app.ehrenamtskarte.backend.stores.database.AcceptingStores
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
                AcceptingStoreEntity
                    .find { AcceptingStores.id inList ids }
                    .sortByKeys({ it.id.value }, ids)
                    .map {
                        AcceptingStore(
                            it.id.value,
                            it.name,
                            it.description,
                            it.contactId.value,
                            it.categoryId.value
                        )
                    }
            }
        }
    }
}
