package app.ehrenamtskarte.backend.config

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory
import com.fasterxml.jackson.module.kotlin.KotlinModule
import java.io.File

data class PostgresConfig(val url: String, val user: String, val password: String)
data class GeocodingConfig(val enabled: Boolean, val host: String)
data class ProjectConfig(val id: String, val importUrl: String, val pipelineName: String)
data class ServerConfig(val dataDirectory: String, val host: String, val port: String)
data class GeneralBackendConfiguration(
    val production: Boolean,
    val server: ServerConfig,
    val postgres: PostgresConfig,
    val geocoding: GeocodingConfig,
    val projects: List<ProjectConfig>
)

data class BackendConfiguration(
    val production: Boolean,
    val server: ServerConfig,
    val postgres: PostgresConfig,
    val geocoding: GeocodingConfig,
    val projects: List<ProjectConfig>,
    val projectId: String? = null
) {
    val project = projects.find { it.id == projectId } ?: throw Exception("Invalid projectId '$projectId' passed!")

    companion object {
        fun from(file: File): BackendConfiguration {
            val mapper = ObjectMapper(YAMLFactory())
            mapper.registerModule(KotlinModule())

            val generalBackendConfiguration = file.bufferedReader().use {
                mapper.readValue(it, GeneralBackendConfiguration::class.java)
            }

            return BackendConfiguration(
                production = generalBackendConfiguration.production,
                postgres = generalBackendConfiguration.postgres,
                geocoding = generalBackendConfiguration.geocoding,
                server = generalBackendConfiguration.server,
                projects = generalBackendConfiguration.projects
            )
        }
    }
}
