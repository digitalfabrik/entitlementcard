package app.ehrenamtskarte.backend.application.webservice

import app.ehrenamtskarte.backend.application.database.ApplicationEntity
import app.ehrenamtskarte.backend.auth.database.AdministratorEntity
import app.ehrenamtskarte.backend.auth.service.Authorizer
import app.ehrenamtskarte.backend.auth.webservice.JwtService
import app.ehrenamtskarte.backend.projects.database.ProjectEntity
import app.ehrenamtskarte.backend.projects.database.Projects
import io.javalin.http.Context
import org.jetbrains.exposed.sql.transactions.transaction
import java.io.File

class ApplicationAttachmentHandler(private val applicationData: File) {

    fun getPath(): String {
        return "/application/{project}/{applicationId}/file/{fileIndex}"
    }

    fun handle(context: Context) {
        val jwtPayload = JwtService.verifyRequest(context)
        if (jwtPayload === null) {
            context.status(403)
            return
        }

        val applicationId = context.pathParam("applicationId").toInt()
        val projectName = context.pathParam("project")
        val (admin, application) = transaction {
            val project = ProjectEntity.find { Projects.project eq projectName }.single()
            val admin =
                AdministratorEntity.findById(jwtPayload.userId)
                    ?: throw IllegalArgumentException("Admin does not exist.")
            if (admin.projectId != project.id) throw IllegalArgumentException("Project of admin does not match project")

            Pair(admin, ApplicationEntity.findById(applicationId))
        }

        val regionId = application?.regionId
        if (regionId == null || !Authorizer.mayViewApplicationsInRegion(admin, regionId.value)) {
            context.status(404)
            return
        }

        val fileIndex = context.pathParam("fileIndex").toInt()
        val file = File(this.applicationData, "$projectName/$applicationId/$fileIndex")
        if (!file.isFile) {
            context.status(404)
        } else {
            val contentType =
                File(this.applicationData, "$projectName/$applicationId/$fileIndex.contentType").readLines()[0]
            context.contentType(contentType)
            context.result(file.inputStream())
        }
    }
}
