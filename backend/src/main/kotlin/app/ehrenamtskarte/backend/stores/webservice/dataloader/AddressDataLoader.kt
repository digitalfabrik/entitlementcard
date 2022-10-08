package app.ehrenamtskarte.backend.stores.webservice.dataloader

import app.ehrenamtskarte.backend.stores.database.repos.AddressRepository
import app.ehrenamtskarte.backend.stores.webservice.schema.types.Address
import kotlinx.coroutines.runBlocking
import org.dataloader.DataLoader
import org.dataloader.DataLoaderFactory
import org.jetbrains.exposed.sql.transactions.transaction
import java.util.concurrent.CompletableFuture

const val ADDRESS_LOADER_NAME = "ADDRESS_LOADER"

val addressLoader: DataLoader<Int, Address?> = DataLoaderFactory.newDataLoader { ids ->
    CompletableFuture.supplyAsync {
        runBlocking {
            transaction {
                AddressRepository.findByIds(ids).map {
                    if (it == null) null
                    else Address(it.id.value, it.street, it.postalCode, it.locaction, it.countryCode)
                }
            }
        }
    }
}
