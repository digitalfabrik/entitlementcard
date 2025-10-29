package app.ehrenamtskarte.backend.config

import org.slf4j.LoggerFactory
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import java.io.File
import java.net.URL
import java.nio.file.Path
import java.nio.file.Paths
import kotlin.io.path.exists

private val logger by lazy { LoggerFactory.getLogger(ConfigurationLoader::class.java) }

@Configuration
class ConfigurationLoader {
    private val defaultConfigFilePaths: List<Path> = listOf(
        Paths.get(System.getProperty("user.dir"), "config.yml"),
        Paths.get(System.getProperty("user.home"), ".config", "entitlementcard", "config.yml"),
        Paths.get("/etc/entitlementcard/config.yml"),
    )

    private val defaultConfigResourceUrls: List<String> = listOf(
        "config/config.local.yml",
        "config/config.yml",
    )

    @Bean
    @ConditionalOnMissingBean(BackendConfiguration::class)
    fun backendConfiguration(): BackendConfiguration {
        val url = findConfigurationUrl()
        return BackendConfiguration.load(url)
    }

    /**
     * Finds the configuration URL from an explicit file or by searching default locations.
     * @param explicitConfigFile An optional, explicitly provided config file.
     * @return The URL to the found configuration file.
     * @throws IllegalStateException if no configuration file can be found.
     */
    fun findConfigurationUrl(explicitConfigFile: File? = null): URL =
        explicitConfigFile?.let {
            logger.info("Load backend configuration from explicit config file '$it'.")
            it.toURI().toURL()
        } ?: defaultConfigFilePaths.firstNotNullOfOrNull { path ->
            if (path.exists()) {
                logger.info("Load backend configuration from implicit config file '$path'.")
                path.toUri().toURL()
            } else {
                null
            }
        } ?: defaultConfigResourceUrls.firstNotNullOfOrNull { resource ->
            ClassLoader.getSystemResource(resource)?.also { url ->
                logger.info("Load default backend configuration from resource '$url'.")
            }
        } ?: throw IllegalStateException(
            "No backend configuration found. Please provide a config.yml file in one of the default locations: " +
                "${defaultConfigFilePaths.joinToString()} or in classpath resources: ${defaultConfigResourceUrls.joinToString()}",
        )
}
