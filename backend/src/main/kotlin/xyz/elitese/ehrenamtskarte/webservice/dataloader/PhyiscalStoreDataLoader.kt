package xyz.elitese.ehrenamtskarte.webservice.dataloader

import kotlinx.coroutines.runBlocking
import org.dataloader.DataLoader
import xyz.elitese.ehrenamtskarte.webservice.schema.types.Address
import xyz.elitese.ehrenamtskarte.webservice.schema.types.Coordinates
import xyz.elitese.ehrenamtskarte.webservice.schema.types.PhysicalStore
import java.util.concurrent.CompletableFuture

const val PHYSICAL_STORE_LOADER_NAME = "PHYSICAL_STORE_LOADER"

val allPhysicalStores = listOf(
        PhysicalStore(1, Address(
                "Washington street",
                "120a",
                "123354",
                "Washington",
                "WAshington State",
                Coordinates(23.23, 23.23)
        ))
)

val physicalStoreLoader = DataLoader<Long, PhysicalStore?> { ids ->
    CompletableFuture.supplyAsync {
        runBlocking {
            ids.map { id -> allPhysicalStores.find { store -> store.id == id } }
        }
    }
}
