package app.ehrenamtskarte.backend.verification.webservice

import io.javalin.Javalin

const val BASE_PATH = "/verification/"

fun setupApp(app: Javalin) {
    val graphQLHandler = VerificationGraphQLHandler()
    app.post(BASE_PATH) { ctx -> graphQLHandler.handle(ctx) }
}
