package app.ehrenamtskarte.backend.auth.webservice.schema

import app.ehrenamtskarte.backend.db.entities.AdministratorEntity
import app.ehrenamtskarte.backend.db.entities.Administrators
import app.ehrenamtskarte.backend.auth.database.PasswordCrypto
import app.ehrenamtskarte.backend.db.repositories.AdministratorsRepository
import app.ehrenamtskarte.backend.common.webservice.context
import app.ehrenamtskarte.backend.exception.service.ProjectNotFoundException
import app.ehrenamtskarte.backend.exception.webservice.exceptions.InvalidLinkException
import app.ehrenamtskarte.backend.exception.webservice.exceptions.PasswordResetKeyExpiredException
import app.ehrenamtskarte.backend.mail.Mailer
import app.ehrenamtskarte.backend.db.entities.Projects
import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import graphql.schema.DataFetchingEnvironment
import org.jetbrains.exposed.sql.LowerCase
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.and
import org.jetbrains.exposed.sql.transactions.transaction
import org.slf4j.LoggerFactory
import java.time.Instant

@Suppress("unused")
class ResetPasswordMutationService {
    @GraphQLDescription("Sends a mail that allows the administrator to reset their password.")
    fun sendResetMail(dfe: DataFetchingEnvironment, project: String, email: String): Boolean {
        val logger = LoggerFactory.getLogger(ResetPasswordMutationService::class.java)
        val backendConfig = dfe.graphQlContext.context.backendConfiguration
        val projectConfig = backendConfig.getProjectConfig(project)
        transaction {
            val user = Administrators.innerJoin(Projects)
                .select(Administrators.columns)
                .where(
                    (Projects.project eq project) and
                        (LowerCase(Administrators.email) eq email.lowercase()) and
                        (Administrators.deleted eq false),
                )
                .singleOrNull()
                ?.let { AdministratorEntity.wrapRow(it) }
            // We don't send error messages for empty collection to the user to avoid scraping of mail addresses
            if (user != null) {
                val key = AdministratorsRepository.setNewPasswordResetKey(user)
                Mailer.sendResetPasswordMail(backendConfig, projectConfig, key, email)
            }
            if (user == null) {
                val context = dfe.graphQlContext.context
                // This logging is used for rate limiting
                // See https://git.tuerantuer.org/DF/salt/pulls/187
                logger.info("${context.remoteIp} $email failed to request password reset mail")
            }
        }
        return true
    }

    @GraphQLDescription("Reset the administrator's password")
    fun resetPassword(
        dfe: DataFetchingEnvironment,
        project: String,
        email: String,
        passwordResetKey: String,
        newPassword: String,
    ): Boolean {
        val logger = LoggerFactory.getLogger(ResetPasswordMutationService::class.java)
        val backendConfig = dfe.graphQlContext.context.backendConfiguration
        val context = dfe.graphQlContext.context
        if (!backendConfig.projects.any { it.id == project }) {
            throw ProjectNotFoundException(project)
        }
        transaction {
            val user = Administrators.innerJoin(Projects)
                .select(Administrators.columns)
                .where(
                    (Projects.project eq project) and
                        (LowerCase(Administrators.email) eq email.lowercase()) and
                        (Administrators.deleted eq false),
                )
                .singleOrNull()
                ?.let { AdministratorEntity.wrapRow(it) }

            val passwordResetKeyHash = user?.passwordResetKeyHash
            // We don't send error messages for empty collection to the user to avoid scraping of mail addresses
            if (user === null || passwordResetKeyHash === null) {
                // This logging is used for rate limiting
                // See https://git.tuerantuer.org/DF/salt/pulls/187
                logger.info(
                    "${context.remoteIp} $email failed to reset password (unknown user or no reset mail sent)",
                )
                return@transaction
            }
            if (user.passwordResetKeyExpiry!!.isBefore(Instant.now())) {
                // This logging is used for rate limiting
                // See https://git.tuerantuer.org/DF/salt/pulls/187
                logger.info("${context.remoteIp} $email failed to reset password (expired reset key)")
                throw PasswordResetKeyExpiredException()
            } else if (!PasswordCrypto.verifyPasswordResetKey(
                    passwordResetKey,
                    passwordResetKeyHash,
                )
            ) {
                // This logging is used for rate limiting
                // See https://git.tuerantuer.org/DF/salt/pulls/187
                logger.info("${context.remoteIp} $email failed to reset password (invalid reset key)")
                throw InvalidLinkException()
            }

            AdministratorsRepository.changePassword(user, newPassword)
        }
        return true
    }
}
