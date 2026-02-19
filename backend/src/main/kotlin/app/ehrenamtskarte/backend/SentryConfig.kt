package app.ehrenamtskarte.backend

import app.ehrenamtskarte.backend.config.BackendConfiguration
import app.ehrenamtskarte.backend.config.Environment
import io.sentry.Sentry
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.context.annotation.Configuration

@Configuration
class SentryConfig(config: BackendConfiguration) {
    init {
        if (config.environment == Environment.PRODUCTION || config.environment == Environment.STAGING) {
            Sentry.init { options ->
                options.dsn = "https://c0c177b8fa35e0fd90d788b0d02bcb2c@sentry.tuerantuer.org//7"
                options.environment = config.environment.name.lowercase()
                options.release = BuildConfig.VERSION_NAME
                options.tracesSampleRate = 0.1
            }

            logger.info("✅ Sentry initialized for environment: {}", config.environment)
        } else {
            logger.warn("⚠️ Sentry is disabled. Check your environment profile and DSN.")
        }
    }

    companion object {
        private val logger: Logger = LoggerFactory.getLogger(SentryConfig::class.java)
    }
}
