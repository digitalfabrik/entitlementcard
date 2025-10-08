package app.ehrenamtskarte.backend.graphql.application

import app.ehrenamtskarte.backend.config.BackendConfiguration
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import java.io.File
import kotlin.math.pow

@Configuration
class ApplicationDataConfig(
    @Suppress("SpringJavaInjectionPointsAutowiringInspection")
    private val backendConfiguration: BackendConfiguration,
) {
    companion object {
        private val MIN_FREE_STORAGE = 2.0.pow(30)
    }

    @Bean
    fun applicationData(): File {
        val dataDirectory = backendConfiguration.server.dataDirectory
        val applicationData = File(dataDirectory, "applications")

        if (applicationData.exists()) {
            if (!applicationData.isDirectory) {
                throw IllegalStateException(
                    "${applicationData.absolutePath} is not a directory. " +
                        "Set the property app.application-data correctly!",
                )
            }
        } else {
            if (!applicationData.mkdirs()) {
                throw IllegalStateException("Failed to create directory ${applicationData.absolutePath}")
            }
        }

        if (applicationData.usableSpace < MIN_FREE_STORAGE) {
            throw IllegalStateException("You need at least 1GiB free storage for the application data!")
        }

        return applicationData
    }
}
