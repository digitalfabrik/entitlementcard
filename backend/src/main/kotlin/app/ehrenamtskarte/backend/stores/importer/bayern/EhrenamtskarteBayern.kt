package app.ehrenamtskarte.backend.stores.importer.bayern

import app.ehrenamtskarte.backend.stores.importer.ImportConfig
import app.ehrenamtskarte.backend.stores.importer.addStep
import app.ehrenamtskarte.backend.stores.importer.bayern.steps.DownloadLbe
import app.ehrenamtskarte.backend.stores.importer.bayern.steps.FilterLbe
import app.ehrenamtskarte.backend.stores.importer.bayern.steps.MapFromLbe
import app.ehrenamtskarte.backend.stores.importer.bayern.steps.PostSanitizeFilter
import app.ehrenamtskarte.backend.stores.importer.bayern.types.FilteredStore
import app.ehrenamtskarte.backend.stores.importer.common.steps.FilterDuplicates
import app.ehrenamtskarte.backend.stores.importer.common.steps.SanitizeAddress
import app.ehrenamtskarte.backend.stores.importer.common.steps.SanitizeGeocode
import app.ehrenamtskarte.backend.stores.importer.common.steps.Store
import app.ehrenamtskarte.backend.stores.importer.nuernberg.steps.WriteCsv
import app.ehrenamtskarte.backend.stores.importer.pipelines.Pipeline
import io.ktor.client.HttpClient
import io.ktor.client.plugins.HttpRequestRetry
import org.slf4j.Logger

object EhrenamtskarteBayern : Pipeline {
    private val httpClient = HttpClient {
        install(HttpRequestRetry) {
            retryOnServerErrors(maxRetries = 5)
            retryOnException(maxRetries = 5, retryOnTimeout = true)
            exponentialDelay()
        }
    }

    override fun import(config: ImportConfig, logger: Logger, filteredStores: MutableList<FilteredStore>) {
        Unit
            .addStep(DownloadLbe(config, logger, httpClient), logger) {
                logger.info("== Download lbe data ==")
            }
            .addStep(FilterLbe(config, logger, filteredStores), logger) {
                logger.info("== Filter lbe data ==")
            }
            .addStep(MapFromLbe(config, logger), logger) {
                logger.info("== Map lbe to internal data ==")
            }
            .addStep(SanitizeAddress(config, logger), logger) {
                logger.info("== Sanitize address ==")
            }
            .addStep(SanitizeGeocode(config, logger, httpClient), logger) {
                logger.info("== Sanitize data with geocoding ==")
            }
            .addStep(PostSanitizeFilter(config, logger, filteredStores), logger) {
                logger.info("== Filter sanitized data ==")
            }
            .addStep(FilterDuplicates(config, logger, filteredStores), logger) {
                logger.info("== Filter duplicated data ==")
            }
            .addStep(WriteCsv(config, filteredStores), logger) {
                logger.info("== Write CSV Filtered Stores")
            }
            .addStep(Store(config, logger), logger) {
                logger.info("== Store remaining data to db ==")
            }
    }
}
