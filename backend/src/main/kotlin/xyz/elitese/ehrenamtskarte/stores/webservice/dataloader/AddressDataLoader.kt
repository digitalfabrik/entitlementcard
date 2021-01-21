package xyz.elitese.ehrenamtskarte.stores.webservice.dataloader

import kotlinx.coroutines.runBlocking
import org.dataloader.DataLoader
import org.jetbrains.exposed.sql.transactions.transaction
import xyz.elitese.ehrenamtskarte.stores.database.repos.AddressRepository
import xyz.elitese.ehrenamtskarte.stores.webservice.schema.types.Address
import java.util.concurrent.CompletableFuture

const val ADDRESS_LOADER_NAME = "ADDRESS_LOADER"

val addressLoader = DataLoader<Int, Address?> { ids ->
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
