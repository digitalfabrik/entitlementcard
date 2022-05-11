package app.ehrenamtskarte.backend.stores.importer

import app.ehrenamtskarte.backend.config.*

data class ImportConfig(val config: BackendConfiguration, val projectId: String) {

    val production: Boolean
        get() = this.config.production

    val server: ServerConfig
        get() = this.config.server

    val postgres: PostgresConfig
        get() = this.config.postgres

    val geocoding: GeocodingConfig
        get() = this.config.geocoding

    val projects: List<ProjectConfig>
        get() = this.config.projects

    fun findProject(): ProjectConfig {
        return config.projects.find { it.id == projectId } ?: throw Exception("Invalid projectId '$projectId' passed!")
    }
}
