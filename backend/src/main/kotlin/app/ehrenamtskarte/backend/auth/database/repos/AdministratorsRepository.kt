package app.ehrenamtskarte.backend.auth.database.repos

import app.ehrenamtskarte.backend.auth.database.AdministratorEntity
import app.ehrenamtskarte.backend.auth.database.Administrators
import app.ehrenamtskarte.backend.auth.database.PasswordCrypto
import app.ehrenamtskarte.backend.auth.webservice.schema.types.Role
import app.ehrenamtskarte.backend.common.database.sortByKeys
import app.ehrenamtskarte.backend.projects.database.ProjectEntity
import app.ehrenamtskarte.backend.projects.database.Projects
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.and
import org.jetbrains.exposed.sql.select

object AdministratorsRepository {

    fun findByIds(ids: List<Int>) =
        AdministratorEntity.find { Administrators.id inList ids }.sortByKeys({ it.id.value }, ids)

    fun findByAuthData(project: String, email: String, password: String): AdministratorEntity? {
        val resultRow = (Administrators innerJoin Projects)
            .slice(Administrators.columns)
            .select(
                (Projects.project eq project) and (Administrators.email eq email)
            )
            .firstOrNull()
        return resultRow?.let {
            val user = AdministratorEntity.wrapRow(it)
            if (PasswordCrypto.verifyPassword(password, user.passwordHash)) {
                user
            } else {
                null
            }
        }
    }

    fun insert(project: String, email: String, password: String, role: Role) {
        val projectId = ProjectEntity.find { Projects.project eq project }.firstOrNull()?.id
            ?: throw IllegalArgumentException("Project does not exist.")

        AdministratorEntity.new {
            this.email = email
            this.projectId = projectId
            this.passwordHash = PasswordCrypto.hashPasswort(password)
            this.role = role.db_value
        }
    }
}
