package app.ehrenamtskarte.backend.common.webservice

import app.ehrenamtskarte.backend.application.webservice.ApplicationAttachmentHandler
import app.ehrenamtskarte.backend.application.webservice.HealthHandler
import app.ehrenamtskarte.backend.config.BackendConfiguration
import app.ehrenamtskarte.backend.map.webservice.MapStyleHandler
import app.ehrenamtskarte.backend.userdata.webservice.UserImportHandler
import io.javalin.Javalin
import io.javalin.http.staticfiles.Location
import java.io.File
import kotlin.math.pow

class WebService {
    companion object {
        private val MIN_FREE_STORAGE = 2.0.pow(30)
    }

    fun start(config: BackendConfiguration) {
        val production = config.production
        val host = config.server.host
        val port = Integer.parseInt(config.server.port)
        val dataDirectory = config.server.dataDirectory
        val applicationData = File(dataDirectory, "applications")

        if (applicationData.exists()) {
            if (!applicationData.isDirectory) {
                throw Error("${applicationData.absolutePath} is not a directory. Set the property app.application-data correctly!")
            }
        } else {
            if (!applicationData.mkdirs()) {
                throw Error("Failed to create directory ${applicationData.absolutePath}")
            }
        }

        if (applicationData.usableSpace < MIN_FREE_STORAGE) {
            throw Error("You need at least 1GiB free storage for the application data!")
        }

        val app = Javalin.create { cfg ->
            if (!production) {
                cfg.bundledPlugins.enableDevLogging()
                cfg.bundledPlugins.enableCors { cors -> cors.addRule { it.anyHost() } }
            }
            cfg.http.maxRequestSize = 5000000
            cfg.staticFiles.add {
                it.directory = "/graphiql"
                it.hostedPath = "/graphiql"
                it.location = Location.CLASSPATH
            }
        }

        val graphQLHandler = GraphQLHandler(config)
        val mapStyleHandler = MapStyleHandler(config)
        val applicationHandler = ApplicationAttachmentHandler(applicationData)
        val healthHandler = HealthHandler(config)
        val userImportHandler = UserImportHandler(config)

        app.post("/") { ctx ->
            if (!production) {
                ctx.header("Access-Control-Allow-Headers: Authorization")
                ctx.header("Access-Control-Allow-Origin: *")
            }
            graphQLHandler.handle(ctx, applicationData)
        }

        app.get(mapStyleHandler.getPath()) { ctx ->
            if (!production) {
                ctx.header("Access-Control-Allow-Headers: Authorization")
                ctx.header("Access-Control-Allow-Origin: *")
            }
            mapStyleHandler.handle(ctx)
        }

        app.get(applicationHandler.getPath()) { ctx ->
            applicationHandler.handle(ctx)
        }

        app.get("/health") { ctx -> healthHandler.handle(ctx) }

        app.post("/users/import") { ctx -> userImportHandler.handle(ctx) }

        app.start(host, port)
        println("Server is running at http://$host:$port")
        println("Goto http://$host:$port/graphiql/ for a graphical editor")
    }
}
