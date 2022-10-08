package app.ehrenamtskarte.backend.application.webservice

import app.ehrenamtskarte.backend.auth.webservice.JwtService
import io.javalin.Javalin
import java.io.File

fun registerApplicationJavalinHandler(javalin: Javalin, applicationData: File) {
    javalin.get("/application/:applicationId/file/:fileIndex") { ctx ->
        if (JwtService.verifyRequest(ctx) !== null) {
            val applicationId = ctx.pathParam("applicationId")
            val fileIndex = ctx.pathParam("fileIndex")
            val file = File(applicationData, "$applicationId/file/$fileIndex")
            if (!file.isFile) {
                ctx.status(404)
            } else {
                ctx.contentType("application/octet-stream")
                ctx.result(file.inputStream())
            }
        } else {
            ctx.status(404)
        }
    }
}
