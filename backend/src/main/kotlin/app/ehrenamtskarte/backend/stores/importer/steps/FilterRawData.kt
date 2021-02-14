package app.ehrenamtskarte.backend.stores.importer.steps

import app.ehrenamtskarte.backend.stores.importer.FilterBuilder
import app.ehrenamtskarte.backend.stores.importer.ImportMonitor
import app.ehrenamtskarte.backend.stores.importer.PipelineStep
import app.ehrenamtskarte.backend.stores.importer.types.LbeAcceptingStore

class FilterRawData(val monitor: ImportMonitor): PipelineStep<List<LbeAcceptingStore>, List<LbeAcceptingStore>> {

    override fun execute(acceptingStores: List<LbeAcceptingStore>): List<LbeAcceptingStore> = acceptingStores.filter { filterLbe(it) }

    private fun filterLbe(store: LbeAcceptingStore) = try {
        val builder = FilterBuilder(store, monitor)
        builder.filterLongitudeAndLatitude()
                && builder.filterPostalCode()
                && builder.filterCategory()

    } catch (e: Exception) {
        monitor.addMessage("$store was filtered out because of unknwon exception while filtering", e)
        false
    }

}


