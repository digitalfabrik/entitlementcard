package app.ehrenamtskarte.backend.config

import org.slf4j.LoggerFactory
import java.io.File
import java.net.URL
import java.nio.file.Path
import java.nio.file.Paths
import kotlin.io.path.exists

object ConfigurationLoader {
    private val logger = LoggerFactory.getLogger(ConfigurationLoader::class.java)

    private val defaultConfigFilePaths: List<Path> = listOf(
        Paths.get(System.getProperty("user.dir"), "config.yml"),
        Paths.get(System.getProperty("user.home"), ".config", "entitlementcard", "config.yml"),
        Paths.get("/etc/entitlementcard/config.yml"),
    )

    private val defaultConfigResourceUrls: List<String> = listOf(
        "config/config.local.yml",
        "config/config.yml",
    )

    /**
     * Finds the configuration URL from an explicit file or by searching default locations.
     * @param explicitConfigFile An optional, explicitly provided config file.
     * @return The URL to the found configuration file.
     * @throws IllegalStateException if no configuration file can be found.
     */
    private fun findConfigurationUrl(explicitConfigFile: File? = null): URL {
        return explicitConfigFile?.let {
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

    /**
     * Loads the BackendConfiguration from a file.
     * If no file is provided, it searches in default locations.
     * @param configFile An optional, explicitly provided config file.
     * @return The loaded BackendConfiguration.
     */
    fun load(configFile: File? = null): BackendConfiguration {
        val url = findConfigurationUrl(configFile)
        return BackendConfiguration.load(url)
    }
}
