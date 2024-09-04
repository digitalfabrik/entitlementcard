package app.ehrenamtskarte.backend.helper

import app.ehrenamtskarte.backend.auth.database.repos.AdministratorsRepository
import app.ehrenamtskarte.backend.auth.webservice.JwtService
import app.ehrenamtskarte.backend.auth.webservice.schema.types.Administrator
import app.ehrenamtskarte.backend.auth.webservice.schema.types.Role
import org.jetbrains.exposed.sql.transactions.transaction

enum class TestAdministrators(
    val project: String,
    val email: String,
    val password: String = "Administrator!",
    val role: Role,
    val regionId: Int? = null
) {
    EAK_REGION_ADMIN(
        project = "bayern.ehrenamtskarte.app",
        email = "region-admin@bayern.ehrenamtskarte.app",
        role = Role.REGION_ADMIN,
        regionId = 16
    ),
    EAK_PROJECT_ADMIN(
        project = "bayern.ehrenamtskarte.app",
        email = "project-admin@bayern.ehrenamtskarte.app",
        role = Role.PROJECT_ADMIN
    );

    fun getJwtToken(): String {
        val adminEntity = transaction {
            AdministratorsRepository.findByAuthData(project, email, password)
                ?: AdministratorsRepository.insert(project, email, password, role, regionId)
        }
        val admin = Administrator.fromDbEntity(adminEntity)
        return JwtService.createToken(admin)
    }
}
