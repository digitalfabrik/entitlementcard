package app.ehrenamtskarte.backend.regions.webservice.dataloader

import app.ehrenamtskarte.backend.regions.database.repos.RegionsRepository
import app.ehrenamtskarte.backend.regions.webservice.schema.types.Region
import kotlinx.coroutines.runBlocking
import org.dataloader.DataLoader
import org.jetbrains.exposed.sql.transactions.transaction
import java.util.concurrent.CompletableFuture

const val REGION_LOADER_NAME = "CATEGORY_LOADER"

val regionLoader = DataLoader<Int, Region?> { ids ->
    CompletableFuture.supplyAsync {
        runBlocking {
            transaction {
                RegionsRepository.findByIds(ids).map {
                    if (it == null) null
                    else Region(it.id.value, it.name, it.name, it.regionIdentifier)
                }
            }
        }
    }
}
