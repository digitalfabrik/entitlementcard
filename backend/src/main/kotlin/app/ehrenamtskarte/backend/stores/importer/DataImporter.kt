package app.ehrenamtskarte.backend.stores.importer

import app.ehrenamtskarte.backend.stores.importer.steps.*
import org.slf4j.LoggerFactory

object DataImporter {

    fun import(manualImport: Boolean): Boolean {
        val logger = LoggerFactory.getLogger(DataImporter::class.java)
        val pipe = {
            Unit.addStep(Download(logger), logger) { logger.info("== Download raw data ==" )}
                .addStep(Filter(logger), logger) { logger.info("== Filter raw data ==") }
                .addStep(Map(logger), logger) { logger.info("== Map raw to internal data ==") }
                .addStep(Sanitize(logger), logger) { logger.info("== Sanitize data ==") }
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
