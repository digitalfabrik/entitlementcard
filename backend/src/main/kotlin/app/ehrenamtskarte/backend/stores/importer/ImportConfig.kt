package app.ehrenamtskarte.backend.stores.importer

import app.ehrenamtskarte.backend.config.BackendConfiguration
import app.ehrenamtskarte.backend.config.ProjectConfig

data class ImportConfig(val backendConfig: BackendConfiguration, val projectId: String) {
    fun findProject(): ProjectConfig =
        backendConfig.projects.find { it.id == projectId }
            ?: throw Exception("Invalid projectId '$projectId' passed!")
}
