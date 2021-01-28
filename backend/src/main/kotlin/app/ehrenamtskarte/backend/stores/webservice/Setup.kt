package app.ehrenamtskarte.backend.stores.webservice

import io.javalin.Javalin

fun setupApp(app: Javalin) {
    val graphQLHandler = StoresGraphQLHandler()
    app.post("/") { ctx -> graphQLHandler.handle(ctx) }
}
