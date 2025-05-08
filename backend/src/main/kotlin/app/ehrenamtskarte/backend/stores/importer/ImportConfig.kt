package app.ehrenamtskarte.backend.stores.importer

import app.ehrenamtskarte.backend.config.BackendConfiguration
import app.ehrenamtskarte.backend.config.ProjectConfig

fun BackendConfiguration.toImportConfig(projectId: String): ImportConfig {
    // TODO Why is this copying necessary? Shouldn't all config objects be immutable?
    val configCopy = this.copy()

    return ImportConfig(
        backendConfig = configCopy,
        project = configCopy.projects.find { it.id == projectId }
            ?: throw Exception("Invalid projectId '$projectId' passed!"),
    )
}

data class ImportConfig(
    val backendConfig: BackendConfiguration,
    val project: ProjectConfig,
)
