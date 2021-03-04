package app.ehrenamtskarte.backend.stores.importer.steps

import app.ehrenamtskarte.backend.stores.importer.FilterBuilder
import app.ehrenamtskarte.backend.stores.importer.PipelineStep
import app.ehrenamtskarte.backend.stores.importer.types.LbeAcceptingStore
import org.slf4j.Logger

class FilterRawData(val logger: Logger): PipelineStep<List<LbeAcceptingStore>, List<LbeAcceptingStore>> {

    override fun execute(acceptingStores: List<LbeAcceptingStore>): List<LbeAcceptingStore> = acceptingStores.filter { filterLbe(it) }

    private fun filterLbe(store: LbeAcceptingStore) = try {
        val builder = FilterBuilder(store, logger)
        builder.filterLongitudeAndLatitude()
                && builder.filterPostalCode()
                && builder.filterCategory()

    } catch (e: Exception) {
        logger.info("$store was filtered out because of unknown exception while filtering", e)
        false
    }

}


