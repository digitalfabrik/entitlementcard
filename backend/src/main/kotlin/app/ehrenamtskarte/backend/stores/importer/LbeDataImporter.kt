package app.ehrenamtskarte.backend.stores.importer

import app.ehrenamtskarte.backend.stores.importer.steps.*
import io.ktor.client.HttpClient
import org.slf4j.LoggerFactory

object LbeDataImporter {
    private val httpClient = HttpClient()

    fun import(manualImport: Boolean): Boolean {
        val logger = LoggerFactory.getLogger(LbeDataImporter::class.java)
        val pipe = {
            Unit.addStep(DownloadLbe(logger, httpClient), logger) { logger.info("== Download lbe data ==" )}
                .addStep(FilterLbe(logger), logger) { logger.info("== Filter lbe data ==") }
                .addStep(MapFromLbe(logger), logger) { logger.info("== Map lbe to internal data ==") }
                .addStep(SanitizeAddress(logger), logger) { logger.info("== Sanitize address ==") }
                .addStep(SanitizeGeocode(logger, httpClient), logger) { logger.info("== Sanitize data with geocoding ==") }
                .addStep(PostSanitizeFilter(logger, httpClient), logger) { logger.info("== Filter sanitized data ==") }
                .addStep(Encode(logger), logger) { logger.info("== Handle encoding issues ==") }
                .addStep(Store(logger, manualImport), logger) { logger.info("== Store remaining data to db ==") }
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
