package xyz.elitese.ehrenamtskarte.webservice

import io.javalin.Javalin
import io.javalin.http.staticfiles.Location
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.async
import kotlinx.coroutines.runBlocking
import org.jetbrains.exposed.sql.transactions.transaction
import xyz.elitese.ehrenamtskarte.database.Database
import xyz.elitese.ehrenamtskarte.importer.AcceptingStoresImporter

const val PORT = 7000

class WebService {
    fun start() {
        Database.setup()
        runBlocking {
            AcceptingStoresImporter.import()
        }

        val app = Javalin.create { cfg ->
            cfg.enableDevLogging()
            cfg.enableCorsForAllOrigins()
            cfg.addStaticFiles("/graphiql", "/graphiql", Location.CLASSPATH)
        }.start(PORT)

        println("Server is running at http://localhost:7000")
        println("Goto http://localhost:7000/graphiql for a graphical editor")

        val graphQLHandler = GraphQLHandler()
        app.post("/") { ctx -> graphQLHandler.handle(ctx.req, ctx.res) }
    }
}
