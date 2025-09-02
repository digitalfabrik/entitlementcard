package app.ehrenamtskarte.backend.db.repositories

import app.ehrenamtskarte.backend.auth.PasswordValidationResult
import app.ehrenamtskarte.backend.auth.PasswordValidator
import app.ehrenamtskarte.backend.auth.database.PasswordCrypto
import app.ehrenamtskarte.backend.auth.webservice.schema.types.NotificationSettings
import app.ehrenamtskarte.backend.auth.webservice.schema.types.Role
import app.ehrenamtskarte.backend.common.database.sortByKeys
import app.ehrenamtskarte.backend.db.entities.AdministratorEntity
import app.ehrenamtskarte.backend.db.entities.Administrators
import app.ehrenamtskarte.backend.db.entities.ProjectEntity
import app.ehrenamtskarte.backend.db.entities.Projects
import app.ehrenamtskarte.backend.exception.service.ProjectNotFoundException
import app.ehrenamtskarte.backend.exception.webservice.exceptions.InvalidPasswordException
import app.ehrenamtskarte.backend.exception.webservice.exceptions.InvalidRoleException
import app.ehrenamtskarte.backend.exception.webservice.exceptions.RegionNotFoundException
import org.jetbrains.exposed.sql.LowerCase
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.and
import org.jetbrains.exposed.sql.transactions.transaction
import java.time.Instant
import java.time.Period
import java.util.UUID

object AdministratorsRepository {
    fun findByIds(ids: List<Int>) =
        AdministratorEntity.find { Administrators.id inList ids }.sortByKeys({ it.id.value }, ids)

    fun emailAlreadyExists(email: String) =
        !AdministratorEntity.find { LowerCase(Administrators.email) eq email.lowercase() }.empty()

    fun findByAuthData(project: String, email: String, password: String): AdministratorEntity? =
        (Administrators innerJoin Projects)
            .select(Administrators.columns)
            .where((Projects.project eq project) and (LowerCase(Administrators.email) eq email.lowercase()))
            .firstOrNull()
            ?.let {
                val user = AdministratorEntity.wrapRow(it)
                val passwordHash = user.passwordHash

                user.takeIf { passwordHash != null && PasswordCrypto.verifyPassword(password, passwordHash) }
            }

    fun insert(
        project: String,
        email: String,
        password: String?,
        role: Role,
        regionId: Int? = null,
    ): AdministratorEntity {
        val projectEntity = ProjectEntity.find { Projects.project eq project }.firstOrNull()
            ?: throw ProjectNotFoundException(project)

        val region = regionId?.let {
            RegionsRepository.findByIdInProject(project, it) ?: throw RegionNotFoundException()
        }

        if (role in setOf(Role.REGION_ADMIN, Role.REGION_MANAGER) && region == null) {
            throw InvalidRoleException()
        } else if (role in setOf(Role.PROJECT_ADMIN) && region != null) {
            throw InvalidRoleException()
        }

        val passwordHash = password?.let {
            val passwordValidation = PasswordValidator.validatePassword(it)
            if (passwordValidation != PasswordValidationResult.VALID) {
                throw InvalidPasswordException()
            }
            PasswordCrypto.hashPassword(it)
        }

        return AdministratorEntity.new {
            this.email = email
            this.projectId = projectEntity.id
            this.regionId = region?.id
            this.passwordHash = passwordHash
            this.role = role.db_value
            this.deleted = false
        }
    }

    fun changePassword(administrator: AdministratorEntity, newPassword: String) {
        val passwordValidationResult = PasswordValidator.validatePassword(newPassword)
        if (passwordValidationResult != PasswordValidationResult.VALID) {
            throw InvalidPasswordException()
        }

        administrator.passwordHash = PasswordCrypto.hashPassword(newPassword)
        administrator.passwordResetKeyHash = null
        administrator.passwordResetKeyExpiry = null
    }

    fun deleteAdministrator(administrator: AdministratorEntity) {
        administrator.deleted = true
        administrator.email = UUID.randomUUID().toString() + "@entitlementcard.app"
        administrator.role = Role.NO_RIGHTS.db_value
    }

    fun setNewPasswordResetKey(administrator: AdministratorEntity): String {
        val passwordResetKey = PasswordCrypto.generatePasswordResetKey()
        administrator.passwordResetKeyHash = PasswordCrypto.hashPasswordResetKey(passwordResetKey)
        administrator.passwordResetKeyExpiry = Instant.now().plus(Period.ofDays(1))
        return passwordResetKey
    }

    fun updateNotificationSettings(administrator: AdministratorEntity, notificationSettings: NotificationSettings) {
        administrator.notificationOnApplication = notificationSettings.notificationOnApplication
        administrator.notificationOnVerification = notificationSettings.notificationOnVerification
    }

    fun getNotificationRecipientsForApplication(project: String, regionId: Int): List<AdministratorEntity> =
        transaction {
            (Administrators innerJoin Projects)
                .select(Administrators.columns)
                .where {
                    (Projects.project eq project) and (Administrators.notificationOnApplication eq true) and
                        (Administrators.regionId eq regionId) and
                        (Administrators.deleted eq false)
                }
                .let { AdministratorEntity.wrapRows(it) }
                .toList()
        }

    fun getNotificationRecipientsForVerification(project: String, regionId: Int): List<AdministratorEntity> =
        transaction {
            (Administrators innerJoin Projects)
                .select(Administrators.columns)
                .where {
                    (Projects.project eq project) and (Administrators.notificationOnVerification eq true) and
                        (Administrators.regionId eq regionId) and
                        (Administrators.deleted eq false)
                }
                .let { AdministratorEntity.wrapRows(it) }
                .toList()
        }
}
