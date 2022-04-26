package app.ehrenamtskarte.backend.stores.importer.pipelines

import app.ehrenamtskarte.backend.config.BackendConfiguration
import org.slf4j.Logger

interface Pipeline {
    fun import(config: BackendConfiguration, logger: Logger)
}
