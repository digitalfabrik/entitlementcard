/*
 * This Kotlin source file was generated by the Gradle 'init' task.
 */
package xyz.elitese.ehrenamtskarte.webservice

import io.javalin.Javalin
import io.javalin.http.staticfiles.Location
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.StdOutSqlLogger
import org.jetbrains.exposed.sql.addLogger
import org.jetbrains.exposed.sql.transactions.transaction
import xyz.elitese.ehrenamtskarte.database.Database

const val PORT = 7000

fun main(args: Array<String>) {
    print(System.getProperty("app.greeting"))
    Database.exampleSetup()
    
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
