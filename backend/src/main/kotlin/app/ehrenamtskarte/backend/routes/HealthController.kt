package app.ehrenamtskarte.backend.routes

import app.ehrenamtskarte.backend.config.BackendConfiguration
import app.ehrenamtskarte.backend.db.entities.ProjectEntity
import app.ehrenamtskarte.backend.db.entities.Projects
import io.swagger.v3.oas.annotations.Operation
import org.jetbrains.exposed.v1.core.inList
import org.jetbrains.exposed.v1.exceptions.ExposedSQLException
import org.jetbrains.exposed.v1.jdbc.transactions.transaction
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class HealthController(
    private val config: BackendConfiguration,
) {
    private val logger = LoggerFactory.getLogger(HealthController::class.java)

    @GetMapping("/health")
    @Operation(
        summary = "Health check for the backend.",
        description = "Returns HTTP 200 if the database connection is working and the projects are loaded. " +
            "Otherwise, returns HTTP 502.",
    )
    fun healthCheck(): ResponseEntity<Void> =
        try {
            transaction {
                val projectIds = config.projects.map { it.id }
                val projects = ProjectEntity.find { Projects.project inList projectIds }

                if (projects.empty()) {
                    logger.warn("Health check failed: No projects found in the database")
                    ResponseEntity.status(HttpStatus.BAD_GATEWAY).build()
                } else {
                    ResponseEntity.ok().build()
                }
            }
        } catch (exception: ExposedSQLException) {
            logger.error("Health check failed due to a database exception", exception)
            ResponseEntity.status(HttpStatus.BAD_GATEWAY).build()
        }
}
