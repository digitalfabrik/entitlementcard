package app.ehrenamtskarte.backend.stores.importer

import app.ehrenamtskarte.backend.config.*

data class ImportConfig(val backendConfig: BackendConfiguration, val projectId: String) {

    fun findProject(): ProjectConfig {
        return backendConfig.projects.find { it.id == projectId } ?: throw Exception("Invalid projectId '$projectId' passed!")
    }
}
