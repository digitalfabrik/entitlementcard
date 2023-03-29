package app.ehrenamtskarte.backend.projects.database

import app.ehrenamtskarte.backend.config.BackendConfiguration
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.transactions.transaction

fun setupDatabase(config: BackendConfiguration) {
    SchemaUtils.create(
        Projects,
    )
    SchemaUtils.createMissingTablesAndColumns(Projects)

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
