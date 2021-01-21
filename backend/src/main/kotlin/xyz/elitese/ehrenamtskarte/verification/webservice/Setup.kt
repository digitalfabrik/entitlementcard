package xyz.elitese.ehrenamtskarte.verification.webservice

import io.javalin.Javalin

const val BASE_PATH = "/verification"

fun setupApp(app: Javalin) {
    val cardHandler = CardHandler()
    app.post("$BASE_PATH/add-card", cardHandler::addCard)
    app.post("$BASE_PATH/verify", cardHandler::verifyCard)
}
