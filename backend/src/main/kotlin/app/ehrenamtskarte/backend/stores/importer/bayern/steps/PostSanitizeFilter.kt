package app.ehrenamtskarte.backend.stores.importer.bayern.steps

import app.ehrenamtskarte.backend.stores.importer.ImportConfig
import app.ehrenamtskarte.backend.stores.importer.PipelineStep
import app.ehrenamtskarte.backend.stores.importer.common.types.AcceptingStore
import io.ktor.client.HttpClient
import kotlinx.coroutines.runBlocking
import org.slf4j.Logger

/**
 * Filters [AcceptingStore] to prepare storing to the database.
 * Stores without longitude, latitude or postal code are removed.
 */
class PostSanitizeFilter(config: ImportConfig, private val logger: Logger, httpClient: HttpClient) :
    PipelineStep<List<AcceptingStore>, List<AcceptingStore>>(config) {
    override fun execute(input: List<AcceptingStore>): List<AcceptingStore> =
        runBlocking {
            input.filter {
                if (it.longitude == null || it.latitude == null) {
                    logger.info("'${it.name}, ${it.location}' was filtered out because longitude or latitude are null")
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
