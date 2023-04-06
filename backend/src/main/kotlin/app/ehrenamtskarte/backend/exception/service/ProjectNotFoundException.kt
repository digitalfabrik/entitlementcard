
package app.ehrenamtskarte.backend.exception.service

class ProjectNotFoundException(projectId: String) : NotFoundException("Project $projectId not found") {
    init {
        printStackTrace()
    }
}
