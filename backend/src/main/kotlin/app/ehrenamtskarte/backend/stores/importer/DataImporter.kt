package app.ehrenamtskarte.backend.stores.importer

import app.ehrenamtskarte.backend.stores.importer.steps.*
import org.slf4j.LoggerFactory

object DataImporter {

    fun import(manualImport: Boolean): Boolean {
        val logger = LoggerFactory.getLogger(DataImporter::class.java)
        val pipe = {
            Unit.addStep(Download(logger), logger) { logger.info("== Download raw data ==" )}
                .addStep(FilterRawData(logger), logger) { logger.info("== Filter raw data ==") }
                .addStep(RawToImportAcceptingStore(logger), logger) { logger.info("== Map raw to internal data ==") }
                .addStep(Encoding(logger), logger) { logger.info("== Handle encoding issues ==") }
                .addStep(DataTransformation(logger), logger) { logger.info("== Transform import data ==")}
                .addStep(StoreToDatabase(logger, manualImport), logger) { logger.info("== Store remaining data to db ==") }
        }

        try {
            pipe()
            logger.info("== Pipeline successfully finished ==")
            return true;
        } catch (e : Exception) {
            logger.info("== Pipeline was aborted without altering the database ==", e)
            return false;
        }
    }
}
