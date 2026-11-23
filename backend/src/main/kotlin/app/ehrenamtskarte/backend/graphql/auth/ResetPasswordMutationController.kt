package app.ehrenamtskarte.backend.graphql.auth

import app.ehrenamtskarte.backend.config.BackendConfiguration
import app.ehrenamtskarte.backend.db.repositories.AdministratorsRepository
import app.ehrenamtskarte.backend.graphql.exceptions.InvalidLinkException
import app.ehrenamtskarte.backend.graphql.exceptions.PasswordResetKeyExpiredException
import app.ehrenamtskarte.backend.shared.crypto.PasswordCrypto
import app.ehrenamtskarte.backend.shared.exceptions.ProjectNotFoundException
import app.ehrenamtskarte.backend.shared.mail.Mailer
import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import com.expediagroup.graphql.generator.annotations.GraphQLIgnore
import org.jetbrains.exposed.v1.jdbc.transactions.transaction
import org.slf4j.LoggerFactory
import org.springframework.graphql.data.method.annotation.Argument
import org.springframework.graphql.data.method.annotation.ContextValue
import org.springframework.graphql.data.method.annotation.MutationMapping
import org.springframework.stereotype.Controller
import java.time.Instant

@Controller
class ResetPasswordMutationController(
    private val backendConfig: BackendConfiguration,
    private val mailerService: Mailer,
) {
    @GraphQLDescription("Sends a mail that allows the administrator to reset their password.")
    @MutationMapping
    fun sendResetMail(
        @Argument project: String,
        @Argument email: String,
        @GraphQLIgnore @ContextValue remoteIp: String,
    ): Boolean {
        val logger = LoggerFactory.getLogger(ResetPasswordMutationController::class.java)
        val projectConfig = backendConfig.getProjectConfig(project)
        transaction {
            val user = AdministratorsRepository.findByEmailInProjectOrWithoutProject(project, email)
                ?.takeIf { !it.deleted }
            // We don't send error messages for empty collection to the user to avoid scraping of mail addresses
            if (user != null) {
                val key = AdministratorsRepository.setNewPasswordResetKey(user)
                mailerService.sendResetPasswordMail(projectConfig, key, email)
            }
            if (user == null) {
                // This logging is used for rate limiting
                // See https://git.tuerantuer.org/DF/salt/pulls/187
                logger.info("$remoteIp $email failed to request password reset mail")
            }
        }
        return true
    }

    @GraphQLDescription("Reset the administrator's password")
    @MutationMapping
    fun resetPassword(
        @Argument project: String,
        @Argument email: String,
        @Argument passwordResetKey: String,
        @Argument newPassword: String,
        @GraphQLIgnore @ContextValue remoteIp: String,
    ): Boolean {
        val logger = LoggerFactory.getLogger(ResetPasswordMutationController::class.java)
        if (!backendConfig.projects.any { it.id == project }) {
            throw ProjectNotFoundException(project)
        }
        transaction {
            val user = AdministratorsRepository.findByEmailInProjectOrWithoutProject(project, email)
                ?.takeIf { !it.deleted }

            val passwordResetKeyHash = user?.passwordResetKeyHash
            // We don't send error messages for empty collection to the user to avoid scraping of mail addresses
            if (user === null || passwordResetKeyHash === null) {
                // This logging is used for rate limiting
                // See https://git.tuerantuer.org/DF/salt/pulls/187
                logger.info(
                    "$remoteIp $email failed to reset password (unknown user or no reset mail sent)",
                )
                return@transaction
            }
            if (user.passwordResetKeyExpiry!!.isBefore(Instant.now())) {
                // This logging is used for rate limiting
                // See https://git.tuerantuer.org/DF/salt/pulls/187
                logger.info("$remoteIp $email failed to reset password (expired reset key)")
                throw PasswordResetKeyExpiredException()
            } else if (!PasswordCrypto.verifyPasswordResetKey(
                    passwordResetKey,
                    passwordResetKeyHash,
                )
            ) {
                // This logging is used for rate limiting
                // See https://git.tuerantuer.org/DF/salt/pulls/187
                logger.info("$remoteIp $email failed to reset password (invalid reset key)")
                throw InvalidLinkException()
            }

            AdministratorsRepository.changePassword(user, newPassword)
        }
        return true
    }
}
