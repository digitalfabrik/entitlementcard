package app.ehrenamtskarte.backend.graphql.regions

import app.ehrenamtskarte.backend.db.repositories.RegionsRepository
import app.ehrenamtskarte.backend.graphql.regions.types.Region
import org.dataloader.BatchLoader
import org.jetbrains.exposed.sql.transactions.transaction
import org.springframework.stereotype.Component
import java.util.concurrent.CompletableFuture

@Component
class RegionDataLoader {
    val dataLoaderName: String = "REGION_LOADER"
    val batchLoader: BatchLoader<Int, Region> = BatchLoader { ids ->
        CompletableFuture.supplyAsync {
            transaction {
                val regions: List<Region?> = RegionsRepository.findByIds(ids).map { entity ->
                    entity?.let {
                        Region(
                            id = it.id.value,
                            prefix = it.prefix,
                            name = it.name,
                            regionIdentifier = it.regionIdentifier,
                            dataPrivacyPolicy = it.dataPrivacyPolicy,
                            activatedForApplication = it.activatedForApplication,
                            activatedForCardConfirmationMail = it.activatedForCardConfirmationMail,
                            applicationConfirmationMailNoteActivated = it.applicationConfirmationMailNoteActivated,
                            applicationConfirmationMailNote = it.applicationConfirmationMailNote,
                        )
                    }
                }
                // The Java BatchLoader interface expects a List<V>, which Kotlin sees as List<Region>
                // when V=Region. However, our logic correctly produces a List<Region?>.
                // Since a Java List<Region> can contain nulls, this cast is safe and necessary
                // to bridge the difference between Kotlin's strict null-safe lists and Java's platform lists.
                @Suppress("UNCHECKED_CAST")
                regions as List<Region>
            }
        }
    }
}
