package app.ehrenamtskarte.backend.common.utils

import io.opentelemetry.api.trace.propagation.W3CTraceContextPropagator
import io.opentelemetry.context.propagation.ContextPropagators
import io.opentelemetry.sdk.OpenTelemetrySdk
import io.opentelemetry.sdk.trace.SdkTracerProvider
import io.sentry.Sentry
import io.sentry.opentelemetry.OpenTelemetryLinkErrorEventProcessor
import io.sentry.opentelemetry.SentryPropagator
import io.sentry.opentelemetry.SentrySpanProcessor

fun initializeSentry() {
    OpenTelemetrySdk.builder()
        .setTracerProvider(
            SdkTracerProvider.builder()
                .addSpanProcessor(SentrySpanProcessor()) // Sendet direkt an Sentry
                .build(),
        )
        .setPropagators(
            ContextPropagators.create(
                io.opentelemetry.context.propagation.TextMapPropagator.composite(
                    W3CTraceContextPropagator.getInstance(),
                    SentryPropagator(),
                ),
            ),
        )
        .buildAndRegisterGlobal()

    Sentry.init { options ->
        options.dsn = "https://c0c177b8fa35e0fd90d788b0d02bcb2c@sentry.tuerantuer.org//7"
        // https://docs.sentry.io/concepts/key-terms/tracing/
        options.tracesSampleRate = 1.0
        // Adds tracing to errors
        options.addEventProcessor(OpenTelemetryLinkErrorEventProcessor())
        options.isDebug = true // Activate debug logs
    }
}

fun reportErrorToSentry(e: Exception) {
    if (Sentry.isEnabled()) {
        Sentry.captureException(e)
    }
}
