package xyz.elitese.ehrenamtskarte.stores.webservice

import io.javalin.Javalin

fun hookInto(app: Javalin) {
    val graphQLHandler = GraphQLHandler()
    app.post("/") { ctx -> graphQLHandler.handle(ctx) }
}
