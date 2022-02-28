package app.ehrenamtskarte.backend.stores.importer.steps

import app.ehrenamtskarte.backend.stores.geocoding.FeatureFetcher
import app.ehrenamtskarte.backend.stores.STATE
import app.ehrenamtskarte.backend.stores.geocoding.isInBoundingBox
import app.ehrenamtskarte.backend.stores.importer.PipelineStep
import app.ehrenamtskarte.backend.stores.importer.types.AcceptingStore
import io.ktor.client.*
import kotlinx.coroutines.runBlocking
import org.slf4j.Logger

/**
 * Filters [AcceptingStore] to prepare storing to the database.
 * Stores without longitude, latitude or postal code or outside the states bounding box are removed.
 */
class PostSanitizeFilter(private val logger: Logger, httpClient: HttpClient): PipelineStep<List<AcceptingStore>, List<AcceptingStore>>() {
    private val featureFetcher = FeatureFetcher(httpClient)

    override fun execute(input: List<AcceptingStore>): List<AcceptingStore> = runBlocking {
        val stateBbox = featureFetcher.queryFeatures(listOf(Pair("state", STATE))).first().bbox

        input.filter {
            if (it.longitude == null || it.latitude == null) {
                logger.info("'${it.name}, ${it.location}' was filtered out because longitude or latitude are null")
                return@filter false
            }
            if (!it.isInBoundingBox(stateBbox)) {
                logger.info("'${it.name}, ${it.location}' was filtered out because it is outside of $STATE")
                return@filter false
            }
            if (it.postalCode == null) {
                // Probably because it is outside of the state but inside the bounding box of the state
                logger.info("'${it.name}, ${it.location}' was filtered out because its postal code is null")
                return@filter false
            }
            true
        }
    }

}
