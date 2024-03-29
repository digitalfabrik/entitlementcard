package app.ehrenamtskarte.backend.projects.database

import app.ehrenamtskarte.backend.config.BackendConfiguration
import org.jetbrains.exposed.sql.transactions.transaction

fun insertOrUpdateProjects(config: BackendConfiguration) {
    transaction {
        val dbProjects = ProjectEntity.all()

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
