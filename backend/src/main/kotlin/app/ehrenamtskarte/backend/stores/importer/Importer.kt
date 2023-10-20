package app.ehrenamtskarte.backend.stores.importer

import app.ehrenamtskarte.backend.stores.importer.bayern.EhrenamtskarteBayern
import app.ehrenamtskarte.backend.stores.importer.nuernberg.SozialpassNuernberg
import app.ehrenamtskarte.backend.stores.importer.pipelines.BerechtigungskarteShowcase
import org.slf4j.LoggerFactory

object Importer {
    fun import(config: ImportConfig): Boolean {
        val logger = LoggerFactory.getLogger(Importer::class.java)
        val project = config.findProject()

        return try {
            logger.info("== Pipeline ${project.pipelineName} started ==")
            when (project.pipelineName) {
                "EhrenamtskarteBayern" -> EhrenamtskarteBayern.import(config, logger)
                "SozialpassNuernberg" -> SozialpassNuernberg.import(config, logger)
                "BerechtigungskarteShowcase" -> BerechtigungskarteShowcase.import(config, logger)
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
