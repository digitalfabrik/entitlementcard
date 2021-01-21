package xyz.elitese.ehrenamtskarte.common.webservice

import io.javalin.Javalin
import io.javalin.http.staticfiles.Location
import xyz.elitese.ehrenamtskarte.stores.webservice.hookInto

const val PORT = 7000

class WebService {
    fun start() {
        val app = Javalin.create { cfg ->
            cfg.enableDevLogging()
            cfg.enableCorsForAllOrigins()
            cfg.addStaticFiles("/graphiql", "/graphiql", Location.CLASSPATH)
        }.start(PORT)

        println("Server is running at http://localhost:${PORT}")
        println("Goto http://localhost:${PORT}/graphiql for a graphical editor")

        hookInto(app)
    }
}
