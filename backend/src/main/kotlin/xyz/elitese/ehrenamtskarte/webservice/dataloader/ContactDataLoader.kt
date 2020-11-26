package xyz.elitese.ehrenamtskarte.webservice.dataloader

import kotlinx.coroutines.runBlocking
import org.dataloader.DataLoader
import xyz.elitese.ehrenamtskarte.webservice.schema.types.Contact
import java.util.concurrent.CompletableFuture

const val CONTACT_LOADER_NAME = "CONTACT_LOADER"

val batchContactLoader = DataLoader<Long, Contact?> { ids ->
    CompletableFuture.supplyAsync {
        runBlocking { // Mock Contact
            listOf(Contact(1, "my@mail.de", "01234 5678", "https://web.site"))
        }
    }
}
