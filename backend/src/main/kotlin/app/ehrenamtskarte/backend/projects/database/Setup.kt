package app.ehrenamtskarte.backend.projects.database

import app.ehrenamtskarte.backend.config.BackendConfiguration
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.transactions.transaction

fun setupDatabase(config: BackendConfiguration) {
    SchemaUtils.create(
        Projects
    )

    transaction {
        val dbProjects = ProjectEntity.all()

        // Delete projects not existing anymore in database
        dbProjects.forEach { dbProject ->
            if (config.projects.none { it.id == dbProject.project }) {
                dbProject.delete()
            }
        }

        // Create missing projects in database
        config.projects.forEach { projectConfig ->
            if (dbProjects.none { it.project == projectConfig.id }) {
                ProjectEntity.new {
                    project = projectConfig.id
                }
            }
        }
    }
}
