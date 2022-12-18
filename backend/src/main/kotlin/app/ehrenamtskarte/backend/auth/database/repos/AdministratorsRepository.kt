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
import app.ehrenamtskarte.backend.regions.database.RegionEntity
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

    fun insert(project: String, email: String, password: String?, role: Role, regionId: Int? = null) {
        val projectEntity = ProjectEntity.find { Projects.project eq project }.firstOrNull()
            ?: throw IllegalArgumentException("Project does not exist.")

        val region = regionId?.let { RegionEntity.findById(regionId) }

        if (region != null && region.projectId != projectEntity.id) {
            throw IllegalArgumentException("Specified region is not part of specified project.")
        }

        if (role in setOf(Role.REGION_ADMIN, Role.REGION_MANAGER) && region == null) {
            throw IllegalArgumentException("Role ${role.db_value} needs to have a region assigned.")
        } else if (role in setOf(Role.PROJECT_ADMIN) && region != null) {
            throw IllegalArgumentException("Role ${role.db_value} cannot have a region assigned.")
        }

        val passwordHash = password?.let {
            val passwordValidation = PasswordValidator.validatePassword(it)
            if (passwordValidation != PasswordValidationResult.VALID) {
                throw InvalidPasswordException(passwordValidation)
            }
            PasswordCrypto.hashPasswort(it)
        }

        AdministratorEntity.new {
            this.email = email
            this.projectId = projectEntity.id
            this.regionId = region?.id
            this.passwordHash = passwordHash
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
        val key = Base64.getUrlEncoder().encodeToString(byteArray)
        administrator.passwordResetKey = key
        administrator.passwordResetKeyExpiry = LocalDateTime.now().plusDays(1)
        return key
    }
}
