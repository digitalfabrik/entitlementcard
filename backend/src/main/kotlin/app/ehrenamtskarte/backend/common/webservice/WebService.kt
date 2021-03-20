package app.ehrenamtskarte.backend.common.webservice

import app.ehrenamtskarte.backend.application.webservice.registerApplicationJavalinHandler
import io.javalin.Javalin
import io.javalin.http.staticfiles.Location
import java.io.File
import kotlin.math.pow

class WebService {
    companion object {
        private const val DEFAULT_PORT = "7000"
        private val MIN_FREE_STORAGE = 2.0.pow(30)
    }

    fun start(production: Boolean) {
        val host = System.getProperty("app.host", "0.0.0.0")
        val port = Integer.parseInt(System.getProperty("app.port", DEFAULT_PORT))
        val applicationDataPath = System.getProperty("app.application-data", null)
            ?: throw Error("Property app.application-data is required!")

        val applicationData = File(applicationDataPath)
        if (!applicationData.isDirectory) {
            throw Error("${applicationData.absolutePath} is not a directory. Set the property app.application-data correctly!")
        }

        if (applicationData.freeSpace < MIN_FREE_STORAGE) {
            throw Error("You need at least 1GiB free storage for the application data!")
        }

        val app = Javalin.create { cfg ->
            if (!production) {
                cfg.enableDevLogging()
                cfg.enableCorsForAllOrigins()
            }
            cfg.addStaticFiles("/graphiql", "/graphiql", Location.CLASSPATH)
        }.start(host, port)

        println("Server is running at http://${host}:${port}")
        println("Goto http://${host}:${port}/graphiql for a graphical editor")

        val graphQLHandler = GraphQLHandler()

        app.post("/") { ctx ->
            if (!production) {
                ctx.header("Access-Control-Allow-Headers: Authorization")
                ctx.header("Access-Control-Allow-Origin: *")
            }
            graphQLHandler.handle(ctx, applicationData)
        }
        
        registerApplicationJavalinHandler(app, applicationData)
    }
}
