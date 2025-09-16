package app.ehrenamtskarte.backend

import app.ehrenamtskarte.backend.config.BackendConfiguration
import app.ehrenamtskarte.backend.config.ConfigurationLoader
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.context.annotation.Bean

@SpringBootApplication
class BackendApplication {
	@Bean //todo: this can be removed after #2506
	fun backendConfiguration(): BackendConfiguration {
		return ConfigurationLoader.load(null)
	}
}
