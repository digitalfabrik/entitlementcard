package app.ehrenamtskarte.backend.stores.importer.nuernberg.steps

import app.ehrenamtskarte.backend.stores.importer.ImportConfig
import app.ehrenamtskarte.backend.stores.importer.PipelineStep
import app.ehrenamtskarte.backend.stores.webservice.schema.types.CSVAcceptingStore
import kotlinx.coroutines.runBlocking
import org.slf4j.Logger

/**
 * Filters out stores with insufficient location info
 */
class FilterData(config: ImportConfig, private val logger: Logger) :
    PipelineStep<List<CSVAcceptingStore>, List<CSVAcceptingStore>>(config) {
    override fun execute(input: List<CSVAcceptingStore>): List<CSVAcceptingStore> =
        runBlocking {
            input.filter {
                if (it.postalCode?.isEmpty()!! || it.houseNumber?.isEmpty()!! || it.location?.isEmpty()!!) {
                    logger.info("'${it.name}' was filtered out because location info is insufficient")
                    return@filter false
                }
                true
            }
        }
}
