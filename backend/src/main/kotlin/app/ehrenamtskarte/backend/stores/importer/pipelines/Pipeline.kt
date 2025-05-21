package app.ehrenamtskarte.backend.stores.importer.pipelines

import app.ehrenamtskarte.backend.stores.importer.ImportConfig
import app.ehrenamtskarte.backend.stores.importer.bayern.types.FilteredStore
import org.slf4j.Logger

interface Pipeline {
    fun import(config: ImportConfig, logger: Logger, filteredStores: MutableList<FilteredStore>)
}
