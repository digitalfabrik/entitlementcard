package app.ehrenamtskarte.backend.common.webservice

import app.ehrenamtskarte.backend.BuildConfig
import app.ehrenamtskarte.backend.routes.HealthHandler
import app.ehrenamtskarte.backend.common.utils.initializeSentry
import app.ehrenamtskarte.backend.config.BackendConfiguration
import app.ehrenamtskarte.backend.config.Environment
import app.ehrenamtskarte.backend.graphql.application.ApplicationAttachmentHandler
import app.ehrenamtskarte.backend.routes.MapStyleHandler
import app.ehrenamtskarte.backend.routes.UserImportHandler
import io.javalin.Javalin
import io.javalin.http.staticfiles.Location
import java.io.File
import kotlin.math.pow

class WebService {
    companion object {
        private val MIN_FREE_STORAGE = 2.0.pow(30)
    }

    fun start(config: BackendConfiguration) {
        val host = config.server.host
        val port = Integer.parseInt(config.server.port)
        val dataDirectory = config.server.dataDirectory
        val applicationData = File(dataDirectory, "applications")

        if (applicationData.exists()) {
            if (!applicationData.isDirectory) {
                throw Error(
                    "${applicationData.absolutePath} is not a directory. " +
                        "Set the property app.application-data correctly!",
                )
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
            if (config.isDevelopment()) {
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

        app.post("/") { context ->
            if (config.isDevelopment()) {
                context.header("Access-Control-Allow-Headers: Authorization")
                context.header("Access-Control-Allow-Origin: *")
            }
            graphQLHandler.handle(context, applicationData)
        }

        app.get(mapStyleHandler.getPath()) { context ->
            if (config.isDevelopment()) {
                context.header("Access-Control-Allow-Headers: Authorization")
                context.header("Access-Control-Allow-Origin: *")
            }
            mapStyleHandler.handle(context)
        }

        app.get(applicationHandler.getPath()) { context ->
            applicationHandler.handle(context)
        }

        app.get("/health") { context -> healthHandler.handle(context) }

        app.post("/users/import") { context -> userImportHandler.handle(context) }

        app.start(host, port)

        if (config.environment == Environment.PRODUCTION) {
            initializeSentry()
            println("Init Sentry for production environment")
        }
        println("Server is running at http://$host:$port")
        println("Goto http://$host:$port/graphiql/ for a graphical editor")
        println("Current backend version: ${BuildConfig.VERSION_NAME}, sha1: ${BuildConfig.COMMIT_HASH}")
    }
}
