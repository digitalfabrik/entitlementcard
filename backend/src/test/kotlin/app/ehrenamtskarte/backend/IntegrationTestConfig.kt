package app.ehrenamtskarte.backend

import app.ehrenamtskarte.backend.config.BackendConfiguration
import kotlinx.io.files.FileNotFoundException
import org.springframework.boot.test.context.TestConfiguration
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Primary

@TestConfiguration
class IntegrationTestConfig {
    @Bean
    @Primary
    fun backendConfiguration(): BackendConfiguration =
        BackendConfiguration.load(
            ClassLoader.getSystemResource("config.test.yml")
                ?: throw FileNotFoundException("src/test/resources/config.test.yml"),
        )
}
