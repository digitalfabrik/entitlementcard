package app.ehrenamtskarte.backend.shared.utils

import app.ehrenamtskarte.backend.BuildConfig
import io.sentry.Sentry

fun initializeSentry() {
    Sentry.init { options ->
        options.dsn = "https://c0c177b8fa35e0fd90d788b0d02bcb2c@sentry.tuerantuer.org//7"
        options.release = BuildConfig.VERSION_NAME
        // https://docs.sentry.io/concepts/key-terms/tracing/
        options.tracesSampleRate = 0.05
    }
}

fun reportErrorToSentry(e: Exception) {
    if (Sentry.isEnabled()) {
        Sentry.captureException(e)
    }
}
