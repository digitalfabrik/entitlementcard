package app.ehrenamtskarte.backend.helper

import app.ehrenamtskarte.backend.auth.database.Administrators
import app.ehrenamtskarte.backend.auth.database.PasswordCrypto
import app.ehrenamtskarte.backend.auth.database.repos.AdministratorsRepository
import app.ehrenamtskarte.backend.auth.webservice.JwtService
import app.ehrenamtskarte.backend.auth.webservice.schema.types.Administrator
import app.ehrenamtskarte.backend.auth.webservice.schema.types.Role
import app.ehrenamtskarte.backend.projects.database.ProjectEntity
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.transactions.transaction

enum class TestAdministrators(
    val id: Int,
    val project: String,
    val email: String,
    val password: String = "Administrator!",
    val role: Role,
    val regionId: Int? = null,
) {
    EAK_REGION_ADMIN(
        id = 1,
        project = "bayern.ehrenamtskarte.app",
        email = "region-admin@bayern.ehrenamtskarte.app",
        role = Role.REGION_ADMIN,
        regionId = 16,
    ),
    EAK_REGION_MANAGER(
        id = 9,
        project = "bayern.ehrenamtskarte.app",
        email = "region-manager@bayern.ehrenamtskarte.app",
        role = Role.REGION_MANAGER,
        regionId = 16,
    ),
    EAK_PROJECT_ADMIN(
        id = 2,
        project = "bayern.ehrenamtskarte.app",
        email = "project-admin@bayern.ehrenamtskarte.app",
        role = Role.PROJECT_ADMIN,
    ),

    /** Special admin for negative tests, because CSV store import is not actually supported in EAK */
    EAK_PROJECT_STORE_MANAGER(
        id = 12,
        project = "bayern.ehrenamtskarte.app",
        email = "project-store-manager@bayern.ehrenamtskarte.app",
        role = Role.PROJECT_STORE_MANAGER,
    ),
    NUERNBERG_PROJECT_STORE_MANAGER(
        id = 3,
        project = "nuernberg.sozialpass.app",
        email = "project-store-manager@nuernberg.sozialpass.app",
        role = Role.PROJECT_STORE_MANAGER,
    ),
    NUERNBERG_PROJECT_ADMIN(
        id = 4,
        project = "nuernberg.sozialpass.app",
        email = "project-admin@nuernberg.sozialpass.app",
        role = Role.PROJECT_ADMIN,
    ),
    KOBLENZ_PROJECT_ADMIN(
        id = 5,
        project = "koblenz.sozialpass.app",
        email = "project-admin@koblenz.sozialpass.app",
        role = Role.PROJECT_ADMIN,
    ),
    KOBLENZ_PROJECT_ADMIN_2(
        id = 6,
        project = "koblenz.sozialpass.app",
        email = "project-admin2@koblenz.sozialpass.app",
        role = Role.PROJECT_ADMIN,
    ),
    KOBLENZ_REGION_ADMIN(
        id = 10,
        project = "koblenz.sozialpass.app",
        email = "region-admin@koblenz.sozialpass.app",
        role = Role.REGION_ADMIN,
        regionId = 95,
    ),
    KOBLENZ_REGION_MANAGER(
        id = 11,
        project = "koblenz.sozialpass.app",
        email = "region-manager@koblenz.sozialpass.app",
        role = Role.REGION_MANAGER,
        regionId = 95,
    ),
    BAYERN_VEREIN_360(
        id = 7,
        project = "bayern.ehrenamtskarte.app",
        email = "verein360@bayern.ehrenamtskarte.app",
        role = Role.EXTERNAL_VERIFIED_API_USER,
    ),
    EAK_REGION_ADMIN_FREINET(
        id = 8,
        project = "bayern.ehrenamtskarte.app",
        email = "region-admin+freinet@bayern.ehrenamtskarte.app",
        role = Role.REGION_ADMIN,
        regionId = 9,
    ),
    ;

    fun getJwtToken(): String {
        val adminEntity = transaction { AdministratorsRepository.findByAuthData(project, email, password) }
            ?: throw Exception("Test administrator not found!")
        val admin = Administrator.fromDbEntity(adminEntity)
        return JwtService.createToken(admin)
    }

    companion object {
        fun createAll() {
            transaction {
                val projectMap = ProjectEntity.all().associateBy { it.project }
                TestAdministrators.entries.forEach { admin ->
                    val project = projectMap[admin.project] ?: throw Exception("Project ${admin.project} not found!")
                    Administrators.insert {
                        it[Administrators.id] = admin.id
                        it[projectId] = project.id
                        it[email] = admin.email
                        it[passwordHash] = PasswordCrypto.hashPassword(admin.password)
                        it[role] = admin.role.db_value
                        it[regionId] = admin.regionId
                        it[deleted] = false
                    }
                }
            }
        }
    }
}
