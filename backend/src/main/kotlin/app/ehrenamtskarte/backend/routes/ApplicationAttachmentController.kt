package app.ehrenamtskarte.backend.routes

import app.ehrenamtskarte.backend.db.entities.AdministratorEntity
import app.ehrenamtskarte.backend.db.entities.ApplicationEntity
import app.ehrenamtskarte.backend.db.entities.ProjectEntity
import app.ehrenamtskarte.backend.db.entities.Projects
import app.ehrenamtskarte.backend.db.entities.mayViewApplicationsInRegion
import app.ehrenamtskarte.backend.db.repositories.RegionsRepository
import app.ehrenamtskarte.backend.graphql.auth.JwtService
import app.ehrenamtskarte.backend.shared.exceptions.ForbiddenException
import app.ehrenamtskarte.backend.shared.exceptions.NotFoundException
import app.ehrenamtskarte.backend.shared.exceptions.ProjectNotFoundException
import app.ehrenamtskarte.backend.shared.exceptions.UnauthorizedException
import org.jetbrains.exposed.sql.transactions.transaction
import org.springframework.core.io.InputStreamResource
import org.springframework.core.io.Resource
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.reactive.function.server.ServerRequest
import java.io.File

@RestController
@RequestMapping("/application")
class ApplicationAttachmentController(
    private val applicationData: File,
) {
    @GetMapping("/{project}/{applicationId}/file/{fileIndex}")
    fun getAttachment(
        @PathVariable project: String,
        @PathVariable applicationId: Int,
        @PathVariable fileIndex: Int,
        request: ServerRequest,
    ): ResponseEntity<Resource> {
        val jwtPayload = request.headers().firstHeader("Authorization")
            ?.let { JwtService.verifyRequest(it) }
            ?: return ResponseEntity.status(HttpStatus.FORBIDDEN).build()

        val (admin, application) = transaction {
            val projectEntity = ProjectEntity
                .find { Projects.project eq project }
                .singleOrNull() ?: throw ProjectNotFoundException(project)
            val admin = AdministratorEntity
                .findById(jwtPayload.adminId) ?: throw UnauthorizedException()

            if (admin.projectId != projectEntity.id) throw UnauthorizedException()
            val applicationEntity = ApplicationEntity.findById(applicationId)
                ?: throw NotFoundException()

            RegionsRepository.findByIdInProject(projectEntity.project, applicationEntity.regionId.value)
                ?: throw NotFoundException()

            Pair(admin, applicationEntity)
        }

        if (!admin.mayViewApplicationsInRegion(application.regionId.value)) {
            throw ForbiddenException()
        }

        val file = File(applicationData, "$project/$applicationId/$fileIndex")
        if (!file.isFile) {
            throw NotFoundException()
        }

        val contentTypeFile = File(applicationData, "$project/$applicationId/$fileIndex.contentType")
        val contentType = if (contentTypeFile.exists()) contentTypeFile.readLines()[0] else "application/octet-stream"

        val resource = InputStreamResource(file.inputStream())

        return ResponseEntity.ok()
            .contentType(MediaType.parseMediaType(contentType))
            .body(resource)
    }
}
