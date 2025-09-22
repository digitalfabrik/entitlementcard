package app.ehrenamtskarte.backend

import app.ehrenamtskarte.backend.config.BackendConfiguration
import org.springframework.boot.test.context.TestConfiguration
import org.springframework.context.annotation.Bean

@TestConfiguration
class IntegrationTestConfig {
    @Bean
    fun backendConfiguration(): BackendConfiguration {
        val resource = ClassLoader.getSystemResource("config.test.yml")
            ?: throw Exception("Configuration resource 'src/test/resources/config.test.yml' not found")
        return BackendConfiguration.load(resource)
    }
}
