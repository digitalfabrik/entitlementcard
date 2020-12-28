package xyz.elitese.ehrenamtskarte.webservice.dataloader

import kotlinx.coroutines.runBlocking
import org.dataloader.DataLoader
import org.jetbrains.exposed.sql.transactions.transaction
import xyz.elitese.ehrenamtskarte.database.AddressEntity
import xyz.elitese.ehrenamtskarte.webservice.schema.types.Address
import java.util.concurrent.CompletableFuture

const val ADDRESS_LOADER_NAME = "ADDRESS_LOADER"

val addressLoader = DataLoader<Int, Address?> { ids ->
    CompletableFuture.supplyAsync {
        runBlocking {
            transaction {
                ids
                    .map { AddressEntity.findById(it) }
                    .map {
                        if (it != null)
                            Address(it.id.value, it.street, it.postalCode, it.locaction, it.countryCode)
                        else null
                    }
            }
        }
    }
}
