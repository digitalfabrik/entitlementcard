package app.ehrenamtskarte.backend.auth.database.repos

import app.ehrenamtskarte.backend.auth.InvalidPasswordException
import app.ehrenamtskarte.backend.auth.PasswordValidationResult
import app.ehrenamtskarte.backend.auth.PasswordValidator
import app.ehrenamtskarte.backend.auth.database.AdministratorEntity
import app.ehrenamtskarte.backend.auth.database.Administrators
import app.ehrenamtskarte.backend.auth.database.PasswordCrypto
import app.ehrenamtskarte.backend.auth.webservice.schema.types.Role
import app.ehrenamtskarte.backend.common.database.sortByKeys
import app.ehrenamtskarte.backend.projects.database.ProjectEntity
import app.ehrenamtskarte.backend.projects.database.Projects
import app.ehrenamtskarte.backend.regions.database.Regions
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.and
import org.jetbrains.exposed.sql.select
import java.security.SecureRandom
import java.time.LocalDateTime
import java.util.Base64

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
            val passwordHash = user.passwordHash
            if (passwordHash !== null && PasswordCrypto.verifyPassword(password, passwordHash)) {
                user
            } else {
                null
            }
        }
    }

    fun insert(project: String, email: String, password: String, role: Role, regionId: Int? = null) {
        val projectId = ProjectEntity.find { Projects.project eq project }.firstOrNull()?.id
            ?: throw IllegalArgumentException("Project does not exist.")

        if (role in setOf(Role.REGION_ADMIN, Role.REGION_MANAGER) && regionId == null) {
            throw IllegalArgumentException("Role ${role.db_value} needs to have a region assigned.")
        } else if (role in setOf(Role.PROJECT_ADMIN) && regionId != null) {
            throw java.lang.IllegalArgumentException("Role ${role.db_value} cannot have a region assigned.")
        }

        val passwordValidation = PasswordValidator.validatePassword(password)
        if (passwordValidation != PasswordValidationResult.VALID) {
            throw InvalidPasswordException(passwordValidation)
        }

        AdministratorEntity.new {
            this.email = email
            this.projectId = projectId
            this.regionId = if (regionId != null) EntityID(regionId, Regions) else null
            this.passwordHash = PasswordCrypto.hashPasswort(password)
            this.role = role.db_value
        }
    }

    fun changePassword(administrator: AdministratorEntity, newPassword: String) {
        val passwordValidationResult = PasswordValidator.validatePassword(newPassword)
        if (passwordValidationResult !== PasswordValidationResult.VALID) {
            throw InvalidPasswordException(passwordValidationResult)
        }

        administrator.passwordHash = PasswordCrypto.hashPasswort(newPassword)
        administrator.passwordResetKey = null
        administrator.passwordResetKeyExpiry = null
    }

    fun setNewPasswordResetKey(administrator: AdministratorEntity): String {
        val byteArray = ByteArray(64)
        SecureRandom.getInstanceStrong().nextBytes(byteArray)
        byteArray.toString()
        val key = Base64.getUrlEncoder().encodeToString(byteArray)
        administrator.passwordResetKey = key
        administrator.passwordResetKeyExpiry = LocalDateTime.now().plusDays(1)
        return key
    }
}
