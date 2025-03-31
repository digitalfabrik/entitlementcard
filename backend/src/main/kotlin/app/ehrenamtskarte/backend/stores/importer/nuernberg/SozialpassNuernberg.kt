package app.ehrenamtskarte.backend.stores.importer.nuernberg

import app.ehrenamtskarte.backend.stores.importer.ImportConfig
import app.ehrenamtskarte.backend.stores.importer.addStep
import app.ehrenamtskarte.backend.stores.importer.common.steps.FilterDuplicates
import app.ehrenamtskarte.backend.stores.importer.common.steps.SanitizeAddress
import app.ehrenamtskarte.backend.stores.importer.common.steps.SanitizeGeocode
import app.ehrenamtskarte.backend.stores.importer.common.steps.Store
import app.ehrenamtskarte.backend.stores.importer.nuernberg.steps.DownloadCsv
import app.ehrenamtskarte.backend.stores.importer.nuernberg.steps.FilterData
import app.ehrenamtskarte.backend.stores.importer.nuernberg.steps.FilterGeoData
import app.ehrenamtskarte.backend.stores.importer.nuernberg.steps.MapFromCsv
import app.ehrenamtskarte.backend.stores.importer.nuernberg.steps.WriteCsv
import app.ehrenamtskarte.backend.stores.importer.pipelines.Pipeline
import io.ktor.client.HttpClient
import io.ktor.client.plugins.HttpRequestRetry
import org.slf4j.Logger

object SozialpassNuernberg : Pipeline {
    private val httpClient = HttpClient {
        install(HttpRequestRetry) {
            retryOnServerErrors(maxRetries = 5)
            retryOnException(maxRetries = 5, retryOnTimeout = true)
            exponentialDelay()
        }
    }

    override fun import(config: ImportConfig, logger: Logger) {
        val csvStores = Unit
            .addStep(DownloadCsv(config, logger), logger) { logger.info("== Download csv data ==") }
        val geocoded = csvStores
            .addStep(FilterData(config, logger), logger) { logger.info("== Filter Data ==") }
            .addStep(MapFromCsv(config, logger), logger) { logger.info("== Map CSV Data ==") }
            .addStep(SanitizeAddress(config, logger), logger) { logger.info("== Sanitize Address ==") }
            .addStep(SanitizeGeocode(config, logger, httpClient), logger) { logger.info("== Get Geoinformation ==") }
        if (config.backendConfig.csvWriter.enabled) {
            Pair(csvStores, geocoded)
                .addStep(WriteCsv(config), logger) { logger.info("== Write csv data ==") }
        }
        geocoded
            .addStep(FilterGeoData(config, logger), logger) { logger.info("== Filter store missing geoinformation ==") }
            .addStep(FilterDuplicates(config, logger), logger) { logger.info("== Filter Duplicates ==") }
            .addStep(Store(config, logger), logger) { logger.info("== Store in DB ==") }
    }
}
