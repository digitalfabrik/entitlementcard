package app.ehrenamtskarte.backend.import.stores.pipelines

import app.ehrenamtskarte.backend.import.stores.ImportConfig
import app.ehrenamtskarte.backend.import.stores.bayern.types.FilteredStore
import org.slf4j.Logger

interface Pipeline {
    fun import(config: ImportConfig, logger: Logger, filteredStores: MutableList<FilteredStore>)
}
