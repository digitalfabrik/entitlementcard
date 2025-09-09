package app.ehrenamtskarte.backend.shared.exceptions

import app.ehrenamtskarte.backend.shared.exceptions.NotFoundException

class ProjectNotFoundException(projectId: String) : NotFoundException("Project $projectId not found") {
    init {
        printStackTrace()
    }
}
