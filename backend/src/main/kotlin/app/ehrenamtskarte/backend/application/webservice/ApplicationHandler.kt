package app.ehrenamtskarte.backend.application.webservice

import app.ehrenamtskarte.backend.auth.webservice.JwtService
import io.javalin.http.Context
import java.io.File

class ApplicationHandler(private val applicationData: File) {

    fun getPath(): String {
        return "/application/{applicationId}/file/{fileIndex}"
    }

    fun handle(context: Context) {
        if (JwtService.verifyRequest(context) !== null) {
            val applicationId = context.pathParam("applicationId")
            val fileIndex = context.pathParam("fileIndex")
            val file = File(this.applicationData, "$applicationId/file/$fileIndex")
            if (!file.isFile) {
                context.status(404)
            } else {
                context.contentType("application/octet-stream")
                context.result(file.inputStream())
            }
        } else {
            context.status(404)
        }
    }
}
