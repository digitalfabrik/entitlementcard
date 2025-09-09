package app.ehrenamtskarte.backend.routes

import app.ehrenamtskarte.backend.db.entities.AdministratorEntity
import app.ehrenamtskarte.backend.db.entities.ApplicationEntity
import app.ehrenamtskarte.backend.db.entities.ProjectEntity
import app.ehrenamtskarte.backend.db.entities.Projects
import app.ehrenamtskarte.backend.db.entities.mayViewApplicationsInRegion
import app.ehrenamtskarte.backend.db.repositories.RegionsRepository
import app.ehrenamtskarte.backend.shared.exceptions.ForbiddenException
import app.ehrenamtskarte.backend.shared.exceptions.NotFoundException
import app.ehrenamtskarte.backend.shared.exceptions.ProjectNotFoundException
import app.ehrenamtskarte.backend.shared.exceptions.UnauthorizedException
import app.ehrenamtskarte.backend.graphql.auth.JwtService
import app.ehrenamtskarte.backend.graphql.shared.exceptions.RegionNotFoundException
import io.javalin.http.Context
import org.jetbrains.exposed.sql.transactions.transaction
import java.io.File

class ApplicationAttachmentHandler(private val applicationData: File) {
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

        if (!admin.mayViewApplicationsInRegion(application.regionId.value)) {
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
