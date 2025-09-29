package app.ehrenamtskarte.backend.shared.exceptions

class ProjectNotFoundException(projectId: String) : NotFoundException("Project '$projectId' not found") {
    init {
        printStackTrace()
    }
}
