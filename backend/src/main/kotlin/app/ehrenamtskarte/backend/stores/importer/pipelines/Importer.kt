package app.ehrenamtskarte.backend.stores.importer.pipelines

import app.ehrenamtskarte.backend.stores.importer.ImportConfig
import app.ehrenamtskarte.backend.stores.importer.bayern.EhrenamtskarteBayern
import app.ehrenamtskarte.backend.stores.importer.nuernberg.SozialpassNuernberg
import org.slf4j.LoggerFactory

object Importer {
    fun import(config: ImportConfig): Boolean {
        val logger = LoggerFactory.getLogger(Importer::class.java)

        return try {
            val project = config.findProject()
            when (project.pipelineName) {
                "EhrenamtskarteBayern" -> EhrenamtskarteBayern.import(config, logger)
                "SozialpassNuernberg" -> SozialpassNuernberg.import(config, logger)
                "Nop" -> {}
                else -> throw Error("Invalid pipeline name '${project.pipelineName}'!")
            }
            logger.info("== Pipeline successfully finished ==")
            true
        } catch (e: Exception) {
            logger.error("== Pipeline was aborted without altering the database ==", e)
            false
        }
    }
}
