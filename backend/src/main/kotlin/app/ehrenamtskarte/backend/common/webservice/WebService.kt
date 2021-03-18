package app.ehrenamtskarte.backend.common.webservice

import io.javalin.Javalin
import io.javalin.http.staticfiles.Location

const val DEFAULT_PORT = "7000"

class WebService {
    fun start() {
        val production = System.getProperty("app.production", "").isNotEmpty()
        val host = System.getProperty("app.host", "0.0.0.0")
        val port = Integer.parseInt(System.getProperty("app.port", DEFAULT_PORT))
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
            ctx.header("Access-Control-Allow-Headers: Authorization")
            ctx.header("Access-Control-Allow-Origin: *")
            graphQLHandler.handle(ctx)
        }
    }
}
