package app.ehrenamtskarte.backend.config

import app.ehrenamtskarte.backend.shared.exceptions.ProjectNotFoundException
import com.fasterxml.jackson.annotation.JsonCreator
import tools.jackson.databind.DeserializationFeature
import tools.jackson.dataformat.yaml.YAMLMapper
import tools.jackson.module.kotlin.kotlinModule
import java.net.URL
import java.time.ZoneId

data class PostgresConfig(val url: String, val user: String, val password: String)

data class MapConfig(val baseUrl: String)

data class GeocodingConfig(val enabled: Boolean, val host: String)

data class SmtpConfig(val host: String, val port: Int, val username: String, val password: String)

data class MatomoConfig(val siteId: Int, val accessToken: String)

data class FreinetConfig(val host: String, val path: String, val portalId: String, val accessToken: String)

data class ProjectConfig(
    val id: String,
    val importUrl: String,
    val pipelineName: String?,
    val administrationBaseUrl: String,
    val administrationName: String,
    val timezone: ZoneId,
    val selfServiceEnabled: Boolean,
    val emailSignature: String,
    val smtp: SmtpConfig,
    val matomo: MatomoConfig?,
    val freinet: FreinetConfig?,
    val filteredStoresOutput: String?,
    val importLogFilePath: String?,
)

data class ServerConfig(val dataDirectory: String, val host: String, val port: String)

enum class Environment {
    PRODUCTION,
    STAGING,
    DEVELOPMENT,
    ;

    companion object {
        @JvmStatic
        @JsonCreator
        fun fromString(value: String): Environment =
            entries.find { it.name.equals(value, ignoreCase = true) }
                ?: throw IllegalArgumentException("Invalid environment: $value")
    }
}

data class BackendConfiguration(
    val environment: Environment,
    val server: ServerConfig,
    val map: MapConfig,
    val postgres: PostgresConfig,
    val geocoding: GeocodingConfig,
    val projects: List<ProjectConfig>,
    val matomoUrl: String,
    val disableMailService: Boolean = false,
) {
    fun isDevelopment(): Boolean = environment == Environment.DEVELOPMENT

    fun getProjectConfig(project: String): ProjectConfig =
        projects.find { it.id == project } ?: throw ProjectNotFoundException(project)

    fun sanityCheckMatomoConfig() {
        val matomoConfigs = projects.mapNotNull { it.matomo }

        if (matomoConfigs.size != matomoConfigs.distinctBy { it.siteId }.count()) {
            throw Error("There are at least two matomo configs with the same siteId")
        }
    }

    companion object {
        private val mapper = YAMLMapper.builder()
            .addModule(kotlinModule())
            // JSR-310 (java.time) support is built into jackson-databind in Jackson 3, no module needed.
            // Allows unknown (potentially future) config options.
            // Without this parsing a config fails if a property is defined that is missing
            // from the BackendConfiguration class. We might want to be able to load configs that contain configuration
            // for future features. Therefore, we want to allow unknown properties.
            .disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
            .build()

        fun load(url: URL): BackendConfiguration =
            url.openStream().use { mapper.readValue(it, BackendConfiguration::class.java) }.also {
                it.sanityCheckMatomoConfig()
            }
    }
}
