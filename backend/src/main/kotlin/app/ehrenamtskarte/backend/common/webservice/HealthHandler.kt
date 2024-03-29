package app.ehrenamtskarte.backend.application.webservice

import app.ehrenamtskarte.backend.config.BackendConfiguration
import app.ehrenamtskarte.backend.projects.database.ProjectEntity
import app.ehrenamtskarte.backend.projects.database.Projects
import io.javalin.http.Context
import org.jetbrains.exposed.exceptions.ExposedSQLException
import org.jetbrains.exposed.sql.transactions.transaction

class HealthHandler(private val config: BackendConfiguration) {
    fun handle(ctx: Context) {
        try {
            ctx.status(200)
            transaction {
                val projectIds = config.projects.map { it.id }
                val projects = ProjectEntity.find { Projects.project inList projectIds }
                if (projects.empty()) {
                    ctx.status(502)
                }
            }
        } catch (exception: ExposedSQLException) {
            ctx.status(502)
        }
    }
}
