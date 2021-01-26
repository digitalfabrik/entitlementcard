package app.ehrenamtskarte.backend.stores.webservice.dataloader

import app.ehrenamtskarte.backend.stores.database.repos.ContactsRepository
import app.ehrenamtskarte.backend.stores.webservice.schema.types.Contact
import kotlinx.coroutines.runBlocking
import org.dataloader.DataLoader
import org.jetbrains.exposed.sql.transactions.transaction
import java.util.concurrent.CompletableFuture

const val CONTACT_LOADER_NAME = "CONTACT_LOADER"

val contactLoader = DataLoader<Int, Contact?> { ids ->
    CompletableFuture.supplyAsync {
        runBlocking {
            transaction {
                ContactsRepository.findByIds(ids).map {
                    if (it == null) null
                    else Contact(it.id.value, it.email, it.telephone, it.website)
                }
            }
        }
    }
}
