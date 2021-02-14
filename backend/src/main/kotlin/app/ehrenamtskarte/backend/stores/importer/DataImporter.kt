package app.ehrenamtskarte.backend.stores.importer

import app.ehrenamtskarte.backend.stores.importer.ImportMonitor
import app.ehrenamtskarte.backend.stores.importer.addStep
import app.ehrenamtskarte.backend.stores.importer.steps.*

object DataImporter {

    fun import(): ImportMonitor {
        val monitor = ImportMonitor()
        val pipe = {
            Unit.addStep(Download(monitor), "== Download raw data ==")
                .addStep(FilterRawData(monitor), "== Filter raw data ==")
                .addStep(RawToImportAcceptingStore(monitor), "== Map raw to internal data ==")
                .addStep(Encoding(monitor), "== Handle encoding issues ==")
                .addStep(StoreToDatabase(monitor), "== Store remaining data to db ==")
        }

        try {
            pipe()
        } catch (e : Exception) {
            monitor.addMessage("Pipeline was aborted without altering the database")
        }

        return monitor
    }

}
