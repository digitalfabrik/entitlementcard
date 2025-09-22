package app.ehrenamtskarte.backend.import.stores

import app.ehrenamtskarte.backend.import.stores.bayern.EhrenamtskarteBayern
import app.ehrenamtskarte.backend.import.stores.bayern.types.FilteredStore
import app.ehrenamtskarte.backend.import.stores.pipelines.BerechtigungskarteShowcase
import org.slf4j.LoggerFactory

object Importer {
    fun import(config: ImportConfig): Boolean {
        val logger = LoggerFactory.getLogger(Importer::class.java)
        val project = config.project
        val filteredStores: MutableList<FilteredStore> = mutableListOf()

        if (project.pipelineName == null) {
            logger.info("There is no store import pipeline for ${project.id}")
            return true
        }

        return try {
            logger.info("== Pipeline ${project.pipelineName} started ==")
            when (project.pipelineName) {
                "EhrenamtskarteBayern" -> EhrenamtskarteBayern.import(config, logger, filteredStores)
                "BerechtigungskarteShowcase" -> BerechtigungskarteShowcase.import(config, logger, filteredStores)
                else -> throw Error("Invalid pipeline name '${project.pipelineName}'!")
            }
            logger.info("== Pipeline ${project.pipelineName} successfully finished ==")
            true
        } catch (e: Exception) {
            logger.error("== Pipeline ${project.pipelineName} was aborted without altering the database ==", e)
            false
        }
    }
}
