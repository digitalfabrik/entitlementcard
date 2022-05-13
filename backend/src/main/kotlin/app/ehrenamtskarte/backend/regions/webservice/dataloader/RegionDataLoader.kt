package app.ehrenamtskarte.backend.regions.webservice.dataloader

import app.ehrenamtskarte.backend.common.database.sortByKeys
import app.ehrenamtskarte.backend.regions.database.RegionEntity
import app.ehrenamtskarte.backend.regions.database.Regions
import app.ehrenamtskarte.backend.regions.webservice.schema.types.Region
import kotlinx.coroutines.runBlocking
import org.dataloader.DataLoader
import org.jetbrains.exposed.sql.transactions.transaction
import java.util.concurrent.CompletableFuture

const val REGION_LOADER_NAME = "REGION_LOADER"

val regionLoader = DataLoader<Int, Region?> { ids ->
    CompletableFuture.supplyAsync {
        runBlocking {
            transaction {
                RegionEntity
                    .find { Regions.id inList ids }
                    .sortByKeys({ it.id.value }, ids)
                    .map { Region(it.id.value, it.prefix, it.name, it.regionIdentifier) }
            }
        }
    }
}
