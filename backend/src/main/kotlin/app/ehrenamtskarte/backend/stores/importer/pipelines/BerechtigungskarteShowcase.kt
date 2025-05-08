package app.ehrenamtskarte.backend.stores.importer.pipelines

import app.ehrenamtskarte.backend.stores.importer.ImportConfig
import app.ehrenamtskarte.backend.stores.importer.bayern.types.FilteredStore
import org.slf4j.Logger

object BerechtigungskarteShowcase : Pipeline {
    override fun import(config: ImportConfig, logger: Logger, filteredStores: MutableList<FilteredStore>) {
        logger.info("The pipeline for the showcase project is empty!")
    }
}
