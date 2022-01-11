package app.ehrenamtskarte.backend.stores.importer.steps

import app.ehrenamtskarte.backend.stores.importer.FilterBuilder
import app.ehrenamtskarte.backend.stores.importer.PipelineStep
import app.ehrenamtskarte.backend.stores.importer.types.LbeAcceptingStore
import org.slf4j.Logger

class Filter(private val logger: Logger): PipelineStep<List<LbeAcceptingStore>, List<LbeAcceptingStore>>() {

    override fun execute(input: List<LbeAcceptingStore>): List<LbeAcceptingStore> = input.filter { filterLbe(it) }

    private fun filterLbe(store: LbeAcceptingStore) = try {
        val builder = FilterBuilder(store, logger)
        builder.filter()
    } catch (e: Exception) {
        logger.info("$store was filtered out because of an unknown exception while filtering", e)
        false
    }

}

