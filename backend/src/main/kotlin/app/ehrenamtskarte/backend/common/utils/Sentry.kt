package app.ehrenamtskarte.backend.common.utils

import io.sentry.Sentry

fun initializeSentry() {
    Sentry.init { options ->
        options.dsn = "https://c0c177b8fa35e0fd90d788b0d02bcb2c@sentry.tuerantuer.org//7"
    }
}

fun reportErrorToSentry(e: Exception) {
    if (Sentry.isEnabled()) {
        Sentry.captureException(e)
    }
}
