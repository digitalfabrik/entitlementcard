package app.ehrenamtskarte.backend.stores.importer.nuernberg

import app.ehrenamtskarte.backend.stores.importer.ImportConfig
import app.ehrenamtskarte.backend.stores.importer.addStep
import app.ehrenamtskarte.backend.stores.importer.common.steps.FilterDuplicates
import app.ehrenamtskarte.backend.stores.importer.common.steps.SanitizeAddress
import app.ehrenamtskarte.backend.stores.importer.nuernberg.steps.DownloadCsv
import app.ehrenamtskarte.backend.stores.importer.nuernberg.steps.FilterData
import app.ehrenamtskarte.backend.stores.importer.nuernberg.steps.FilterGeoData
import app.ehrenamtskarte.backend.stores.importer.nuernberg.steps.MapFromCsv
import app.ehrenamtskarte.backend.stores.importer.nuernberg.steps.SanitizeGeocode
import app.ehrenamtskarte.backend.stores.importer.nuernberg.steps.Store
import app.ehrenamtskarte.backend.stores.importer.pipelines.Pipeline
import io.ktor.client.HttpClient
import org.slf4j.Logger

object SozialpassNuernberg : Pipeline {
    private val httpClient = HttpClient()
    override fun import(config: ImportConfig, logger: Logger) {

        Unit.addStep(DownloadCsv(config, logger), logger) { logger.info("== Download csv data ==") }
            .addStep(FilterData(config, logger), logger) { logger.info(" ==Filter Data ==") }
            .addStep(MapFromCsv(config, logger), logger) { logger.info("== Map CSV Data ==") }
            .addStep(SanitizeAddress(config, logger), logger) { logger.info("== Sanitize Address ==") }
            .addStep(SanitizeGeocode(config, httpClient), logger) { logger.info("== Get Geoinformation ==") }
            .addStep(FilterGeoData(config, logger), logger) { logger.info("== Filter store missing geoinformation ==") }
            .addStep(FilterDuplicates(config, logger), logger) { logger.info("== Filter Duplicates ==") }
            .addStep(Store(config, logger), logger) { logger.info("== Store in DB ==") }
    }
}
