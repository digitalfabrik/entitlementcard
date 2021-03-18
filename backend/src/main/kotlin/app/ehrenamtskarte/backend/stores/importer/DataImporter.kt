package app.ehrenamtskarte.backend.stores.importer

import app.ehrenamtskarte.backend.stores.database.Categories
import app.ehrenamtskarte.backend.stores.database.CategoryEntity
import app.ehrenamtskarte.backend.stores.database.PhysicalStores
import app.ehrenamtskarte.backend.stores.importer.steps.*
import app.ehrenamtskarte.backend.stores.importer.types.Category
import com.beust.klaxon.Klaxon
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction
import org.slf4j.LoggerFactory

object DataImporter {

    fun import(manualImport: Boolean): Boolean {
        prepareCategories()

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

    fun prepareCategories() {
        val categoriesJson = DataImporter::class.java
            .getResource("/import/categories.json").readText()
        val categories = Klaxon().parseArray<Category>(categoriesJson)!!

        // Please note that categories should never be empty in case of import because it would not be truncated
        // Therefore this routine should only apply in the first startup
        transaction {
            val count = Categories.selectAll().count()
            if (count == 0L)
                categories.forEach { CategoryEntity.new(it.id) { name = it.name } }
        }
    }

}
