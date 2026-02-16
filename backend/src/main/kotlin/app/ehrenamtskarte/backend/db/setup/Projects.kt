package app.ehrenamtskarte.backend.db.setup

import app.ehrenamtskarte.backend.config.BackendConfiguration
import app.ehrenamtskarte.backend.db.entities.ProjectEntity
import org.jetbrains.exposed.v1.jdbc.transactions.transaction

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
