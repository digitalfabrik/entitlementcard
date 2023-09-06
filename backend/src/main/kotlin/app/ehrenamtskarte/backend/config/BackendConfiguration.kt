package app.ehrenamtskarte.backend.config

import app.ehrenamtskarte.backend.stores.importer.ImportConfig
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import com.fasterxml.jackson.module.kotlin.KotlinModule
import org.slf4j.LoggerFactory
import java.io.File
import java.net.URL
import java.nio.file.Paths
import java.time.ZoneId

val possibleBackendConfigurationFiles =
    listOf<File>(
        Paths.get(System.getProperty("user.dir"), "config.yml").toFile(),
        Paths.get(System.getProperty("user.home"), ".config", "entitlementcard", "config.yml").toFile(),
        Paths.get("/etc/entitlementcard/config.yml").toFile()
    )

data class PostgresConfig(val url: String, val user: String, val password: String)
data class MapConfig(val baseUrl: String)
data class GeocodingConfig(val enabled: Boolean, val host: String)
data class CsvWriterConfig(val enabled: Boolean)
data class SmtpConfig(val host: String, val port: Int, val username: String, val password: String)
data class MatomoConfig(val siteId: Int, val url: String, val accessToken: String)
data class ProjectConfig(
    val id: String,
    val importUrl: String,
    val pipelineName: String,
    val administrationBaseUrl: String,
    val administrationName: String,
    val timezone: ZoneId,
    val smtp: SmtpConfig,
    val matomo: MatomoConfig?
)

data class ServerConfig(val dataDirectory: String, val host: String, val port: String)

data class BackendConfiguration(
    val production: Boolean,
    val server: ServerConfig,
    val map: MapConfig,
    val postgres: PostgresConfig,
    val geocoding: GeocodingConfig,
    val projects: List<ProjectConfig>,
    val csvWriter: CsvWriterConfig
) {

    fun sanityCheckMatomoConfig(): BackendConfiguration {
        val matomoConfig = projects.mapNotNull { it.matomo }
        if (matomoConfig.size != matomoConfig.distinctBy { Pair(it.siteId, it.url) }.count()) {
            throw Error("There are at least two matomo configs with the same siteId and url. This seems to be a copy/paste error.")
        }
        return this
    }

    fun toImportConfig(projectId: String): ImportConfig {
        return ImportConfig(this.copy(), projectId)
    }

    companion object {
        private val mapper = ObjectMapper(YAMLFactory())
            .registerModule(
                KotlinModule.Builder().build()
            ).registerModule(JavaTimeModule())
        private val logger = LoggerFactory.getLogger(BackendConfiguration::class.java)

        fun load(configFile: URL?): BackendConfiguration {
            val fallbacks = listOfNotNull(
                ClassLoader.getSystemResource("config/config.local.yml"),
                ClassLoader.getSystemResource("config/config.yml")
            )
            if (fallbacks.isEmpty()) {
                throw Error("Fallback backend configuration resource 'config/config.yml' missing!")
            }

            val url =
                configFile
                    ?: possibleBackendConfigurationFiles.find { it.exists() }?.toURI()?.toURL()
                    ?: fallbacks[0]

            logger.info("Loading backend configuration from $url.")

            return from(url).sanityCheckMatomoConfig()
        }

        private fun from(url: URL): BackendConfiguration =
            mapper.readValue(url, BackendConfiguration::class.java)
    }
}
