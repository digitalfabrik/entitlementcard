package app.ehrenamtskarte.backend.stores.importer

import app.ehrenamtskarte.backend.stores.importer.ImportMonitor
import app.ehrenamtskarte.backend.stores.importer.addStep
import app.ehrenamtskarte.backend.stores.importer.steps.*

object DataImporter {

    fun import(): ImportMonitor {
        val monitor = ImportMonitor(true)
        val pipe = {
            Unit.addStep(Download(monitor)) { monitor.addMessage("== Download raw data ==" )}
                .addStep(FilterRawData(monitor)) { monitor.addMessage("== Filter raw data ==") }
                .addStep(RawToImportAcceptingStore(monitor)) { monitor.addMessage("== Map raw to internal data ==") }
                .addStep(Encoding(monitor)) { monitor.addMessage("== Handle encoding issues ==") }
                .addStep(StoreToDatabase(monitor)) { monitor.addMessage("== Store remaining data to db ==") }
        }

        try {
            pipe()
            monitor.addMessage("== Pipeline successfully finished ==")
        } catch (e : Exception) {
            monitor.addMessage("== Pipeline was aborted without altering the database ==")
        }

        return monitor
    }

}
