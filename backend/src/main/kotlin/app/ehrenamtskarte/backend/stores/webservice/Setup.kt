package app.ehrenamtskarte.backend.stores.webservice

import io.javalin.Javalin

const val BASE_PATH = "/stores/"

fun setupApp(app: Javalin) {
    val graphQLHandler = StoresGraphQLHandler()
    app.post(BASE_PATH) { ctx -> graphQLHandler.handle(ctx) }
}
