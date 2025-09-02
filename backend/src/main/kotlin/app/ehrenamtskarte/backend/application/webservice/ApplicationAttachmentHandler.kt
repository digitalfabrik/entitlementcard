package app.ehrenamtskarte.backend.application.webservice

import app.ehrenamtskarte.backend.db.entities.ApplicationEntity
import app.ehrenamtskarte.backend.auth.database.AdministratorEntity
import app.ehrenamtskarte.backend.auth.service.Authorizer
import app.ehrenamtskarte.backend.auth.webservice.JwtService
import app.ehrenamtskarte.backend.exception.service.ForbiddenException
import app.ehrenamtskarte.backend.exception.service.NotFoundException
import app.ehrenamtskarte.backend.exception.service.ProjectNotFoundException
import app.ehrenamtskarte.backend.exception.service.UnauthorizedException
import app.ehrenamtskarte.backend.exception.webservice.exceptions.RegionNotFoundException
import app.ehrenamtskarte.backend.projects.database.ProjectEntity
import app.ehrenamtskarte.backend.projects.database.Projects
import app.ehrenamtskarte.backend.regions.database.repos.RegionsRepository
import io.javalin.http.Context
import org.jetbrains.exposed.sql.transactions.transaction
import java.io.File

class ApplicationAttachmentHandler(private val applicationData: File) {
    fun getPath(): String = "/application/{project}/{applicationId}/file/{fileIndex}"

    fun handle(context: Context) {
        val jwtPayload = JwtService.verifyRequest(context)
        if (jwtPayload == null) {
            context.status(403)
            return
        }

        val applicationId = context.pathParam("applicationId").toInt()
        val projectId = context.pathParam("project")
        val (admin, application) = transaction {
            val project = ProjectEntity
                .find { Projects.project eq projectId }
                .singleOrNull()
                ?: throw ProjectNotFoundException(projectId)
            val admin = AdministratorEntity
                .findById(jwtPayload.adminId)
                ?: throw UnauthorizedException()

            if (admin.projectId != project.id) throw UnauthorizedException()
            val application = ApplicationEntity.findById(applicationId) ?: throw NotFoundException()

            RegionsRepository
                .findByIdInProject(project.project, application.regionId.value)
                ?: throw RegionNotFoundException()

            Pair(admin, application)
        }

        if (!Authorizer.mayViewApplicationsInRegion(admin, application.regionId.value)) {
            throw ForbiddenException()
        }

        val fileIndex = context.pathParam("fileIndex").toInt()
        val file = File(this.applicationData, "$projectId/$applicationId/$fileIndex")
        if (!file.isFile) {
            throw NotFoundException()
        } else {
            val contentType =
                File(
                    this.applicationData,
                    "$projectId/$applicationId/$fileIndex.contentType",
                ).readLines()[0]
            context.contentType(contentType)
            context.result(file.inputStream())
        }
    }
}
