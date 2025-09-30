package app.ehrenamtskarte.backend.import.stores.pipelines

import app.ehrenamtskarte.backend.import.stores.ImportConfig
import app.ehrenamtskarte.backend.import.stores.bayern.types.FilteredStore
import org.slf4j.Logger

object BerechtigungskarteShowcase : Pipeline {
    override fun import(config: ImportConfig, logger: Logger, filteredStores: MutableList<FilteredStore>) {
        logger.info("The pipeline for the showcase project is empty!")
    }
}
