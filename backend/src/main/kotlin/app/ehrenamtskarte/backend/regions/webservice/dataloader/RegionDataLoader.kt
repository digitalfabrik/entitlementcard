package app.ehrenamtskarte.backend.regions.webservice.dataloader

import app.ehrenamtskarte.backend.regions.database.repos.RegionsRepository
import app.ehrenamtskarte.backend.regions.webservice.schema.types.Region
import kotlinx.coroutines.runBlocking
import org.dataloader.DataLoader
import org.dataloader.DataLoaderFactory
import org.jetbrains.exposed.sql.transactions.transaction
import java.util.concurrent.CompletableFuture

const val REGION_LOADER_NAME = "REGION_LOADER"

val regionLoader: DataLoader<Int, Region?> = DataLoaderFactory.newDataLoader { ids ->
    CompletableFuture.supplyAsync {
        runBlocking {
            transaction {
                RegionsRepository.findByIds(ids).map {
                    if (it == null) null
                    else Region(it.id.value, it.prefix, it.name, it.regionIdentifier, it.dataPrivacyPolicy)
                }
            }
        }
    }
}
