package app.ehrenamtskarte.backend.import.stores.bayern.steps

import app.ehrenamtskarte.backend.import.stores.ImportConfig
import app.ehrenamtskarte.backend.import.stores.PipelineStep
import app.ehrenamtskarte.backend.import.stores.bayern.types.FilteredStore
import app.ehrenamtskarte.backend.import.stores.common.types.AcceptingStore
import kotlinx.coroutines.runBlocking
import org.slf4j.Logger

/**
 * Filters [AcceptingStore] to prepare storing to the database.
 * Stores without longitude, latitude or postal code are removed.
 */
class PostSanitizeFilter(
    config: ImportConfig,
    private val logger: Logger,
    private val filteredStores: MutableList<FilteredStore>,
) :
    PipelineStep<List<AcceptingStore>, List<AcceptingStore>>(config) {
    override fun execute(input: List<AcceptingStore>): List<AcceptingStore> =
        runBlocking {
            input.filter {
                if (it.longitude == null || it.latitude == null) {
                    logger.info("'${it.name}, ${it.location}' was filtered out because longitude or latitude are null")
                    filteredStores.add(FilteredStore(it, "longitude or latitude are null"))
                    return@filter false
                }
                if (it.postalCode == null) {
                    // Probably because it is outside of the state but inside the bounding box of the state
                    logger.info("'${it.name}, ${it.location}' was filtered out because its postal code is null")
                    filteredStores.add(FilteredStore(it, "Postal code is null"))
                    return@filter false
                }
                true
            }
        }
}
