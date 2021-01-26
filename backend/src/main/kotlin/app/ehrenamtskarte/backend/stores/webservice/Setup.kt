package app.ehrenamtskarte.backend.stores.webservice

import io.javalin.Javalin

fun setupApp(app: Javalin) {
    val graphQLHandler = GraphQLHandler()
    app.post("/") { ctx -> graphQLHandler.handle(ctx) }
}
