package app.ehrenamtskarte.backend.stores.importer

import app.ehrenamtskarte.backend.config.BackendConfiguration
import app.ehrenamtskarte.backend.stores.importer.steps.*
import io.ktor.client.HttpClient
import org.slf4j.LoggerFactory

object LbeDataImporter {
    private val httpClient = HttpClient()

    fun import(config: BackendConfiguration): Boolean {
        val logger = LoggerFactory.getLogger(LbeDataImporter::class.java)
        val pipe = {
            Unit.addStep(DownloadLbe(config, logger, httpClient), logger) { logger.info("== Download lbe data ==" )}
                .addStep(FilterLbe(config, logger), logger) { logger.info("== Filter lbe data ==") }
                .addStep(MapFromLbe(config, logger), logger) { logger.info("== Map lbe to internal data ==") }
                .addStep(SanitizeAddress(config, logger), logger) { logger.info("== Sanitize address ==") }
                .addStep(SanitizeGeocode(config, logger, httpClient), logger) { logger.info("== Sanitize data with geocoding ==") }
                .addStep(PostSanitizeFilter(config, logger, httpClient), logger) { logger.info("== Filter sanitized data ==") }
                .addStep(FilterDuplicates(config, logger), logger) { logger.info("== Filter duplicated data ==") }
                .addStep(Store(config, logger), logger) { logger.info("== Store remaining data to db ==") }
        }

        return try {
            pipe()
            logger.info("== Pipeline successfully finished ==")
            true
        } catch (e : Exception) {
            logger.info("== Pipeline was aborted without altering the database ==", e)
            false
        }
    }
}
