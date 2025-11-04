package app.ehrenamtskarte.backend

import app.ehrenamtskarte.backend.config.BackendConfiguration
import app.ehrenamtskarte.backend.config.Environment
import org.springframework.stereotype.Component
import org.springframework.web.reactive.config.CorsRegistry
import org.springframework.web.reactive.config.WebFluxConfigurer

/**
 * Development-only configuration that adds CORS headers to responses.
 * Without these headers, browsers block requests from the frontend to the backend API.
 * This setup allows all origins during development but is disabled in other environments.
 */
@Component
class DevCorsConfigurer(
    private val config: BackendConfiguration,
) : WebFluxConfigurer {
    override fun addCorsMappings(registry: CorsRegistry) {
        if (config.environment == Environment.DEVELOPMENT) {
            registry.addMapping("/**")
                .allowedOrigins("*")
        }
    }
}
