package app.ehrenamtskarte.backend.common.webservice

import app.ehrenamtskarte.backend.auth.webservice.JwtService
import io.javalin.Javalin
import io.javalin.http.Context
import io.javalin.http.staticfiles.Location
import java.io.File

const val DEFAULT_PORT = "7000"

class WebService {
    fun start(production: Boolean) {
        val host = System.getProperty("app.host", "0.0.0.0")
        val port = Integer.parseInt(System.getProperty("app.port", DEFAULT_PORT))
        val filesDirectory = System.getenv("APPLICATIONS_DIRECTORY") ?: ""
        if (!File(filesDirectory).isDirectory) {
            throw Error(File(filesDirectory).absolutePath + " is not a directory. Set the env variable APPLICATIONS_DIRECTORY!")
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
            graphQLHandler.handle(ctx)
        }


        app.get("/application/:applicationId/file/:fileIndex") { ctx ->
            if (getJwtTokenFromHeader(ctx)?.let(JwtService::verifyToken) !== null) {
                val applicationId = ctx.pathParam("applicationId")
                val fileIndex = ctx.pathParam("fileIndex");
                val file = File("$filesDirectory/$applicationId/file/$fileIndex")
                if (!file.isFile) {
                    ctx.status(404)
                } else {
                    ctx.contentType("application/octet-stream")
                    ctx.result(file.inputStream())
                }
            }
        }
    }
}



fun getJwtTokenFromHeader(context: Context): String? {
    val header = context.header("Authorization") ?: return null
    val split = header.split(" ")
    return if (split.size != 2 || split[0] != "Bearer") null else split[1]
}
