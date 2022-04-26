package app.ehrenamtskarte.backend.stores.importer.pipelines

import app.ehrenamtskarte.backend.config.BackendConfiguration
import app.ehrenamtskarte.backend.stores.importer.addStep
import app.ehrenamtskarte.backend.stores.importer.steps.*
import io.ktor.client.HttpClient
import org.slf4j.Logger

object EhrenamtskarteBayern: Pipeline {
    private val httpClient = HttpClient()

    override fun import(config: BackendConfiguration, logger: Logger) {
        Unit.addStep(DownloadLbe(config, logger, httpClient), logger) { logger.info("== Download lbe data ==") }
            .addStep(FilterLbe(config, logger), logger) { logger.info("== Filter lbe data ==") }
            .addStep(MapFromLbe(config, logger), logger) { logger.info("== Map lbe to internal data ==") }
            .addStep(SanitizeAddress(config, logger), logger) { logger.info("== Sanitize address ==") }
            .addStep(SanitizeGeocode(config, logger, httpClient), logger) { logger.info("== Sanitize data with geocoding ==") }
            .addStep(PostSanitizeFilter(config, logger, httpClient), logger) { logger.info("== Filter sanitized data ==") }
            .addStep(FilterDuplicates(config, logger), logger) { logger.info("== Filter duplicated data ==") }
            .addStep(Store(config, logger), logger) { logger.info("== Store remaining data to db ==") }
    }
}
