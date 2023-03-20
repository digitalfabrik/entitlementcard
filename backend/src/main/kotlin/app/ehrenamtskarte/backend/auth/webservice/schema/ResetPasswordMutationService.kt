package app.ehrenamtskarte.backend.auth.webservice.schema

import app.ehrenamtskarte.backend.auth.database.AdministratorEntity
import app.ehrenamtskarte.backend.auth.database.Administrators
import app.ehrenamtskarte.backend.auth.database.repos.AdministratorsRepository
import app.ehrenamtskarte.backend.common.webservice.GraphQLContext
import app.ehrenamtskarte.backend.mail.Mailer
import app.ehrenamtskarte.backend.projects.database.Projects
import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import graphql.schema.DataFetchingEnvironment
import org.jetbrains.exposed.sql.LowerCase
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.and
import org.jetbrains.exposed.sql.select
import org.jetbrains.exposed.sql.transactions.transaction
import java.net.URLEncoder
import java.nio.charset.StandardCharsets
import java.time.LocalDateTime

@Suppress("unused")
class ResetPasswordMutationService {
    @GraphQLDescription("Sends a mail that allows the administrator to reset their password.")
    fun sendResetMail(dfe: DataFetchingEnvironment, project: String, email: String): Boolean {
        val backendConfig = dfe.getContext<GraphQLContext>().backendConfiguration
        val projectConfig = backendConfig.projects.first { it.id == project }
        transaction {
            val user = Administrators.innerJoin(Projects).slice(Administrators.columns)
                .select((Projects.project eq project) and (LowerCase(Administrators.email) eq email.lowercase()))
                .single().let { AdministratorEntity.wrapRow(it) }

            val key = AdministratorsRepository.setNewPasswordResetKey(user)
            Mailer.sendMail(
                backendConfig,
                projectConfig.smtp,
                projectConfig.administrationName,
                email,
                "Passwort Zurücksetzen",
                generateResetMailMessage(key, projectConfig.administrationName, projectConfig.administrationBaseUrl),
            )
        }
        return true
    }

    private fun generateResetMailMessage(
        key: String,
        administrationName: String,
        administrationBaseUrl: String,
    ): String {
        return """
            Guten Tag,
            
            Sie haben angefragt, Ihr Passwort für $administrationName zurückzusetzen.
            Sie können Ihr Passwort unter dem folgenden Link zurücksetzen:
            $administrationBaseUrl/reset-password/${URLEncoder.encode(key, StandardCharsets.UTF_8)}
            
            Falls ihr Browser den Link nicht korrekt auflösen kann, kopieren Sie bitte folgenden Link in Ihren Browser:
            $administrationBaseUrl/reset-password/$key
            
            Dieser Link ist 24 Stunden gültig.
            
            Dies ist eine automatisierte Nachricht. Antworten Sie nicht auf diese Email.
            
            - $administrationName
        """.trimIndent()
    }

    @GraphQLDescription("Reset the administrator's password")
    fun resetPassword(project: String, email: String, passwordResetKey: String, newPassword: String): Boolean {
        transaction {
            val user = Administrators.innerJoin(Projects).slice(Administrators.columns)
                .select((Projects.project eq project) and (LowerCase(Administrators.email) eq email.lowercase()))
                .single().let { AdministratorEntity.wrapRow(it) }

            if (user.passwordResetKeyExpiry!!.isBefore(LocalDateTime.now())) {
                throw Exception("Password reset key has expired.")
            } else if (user.passwordResetKey != passwordResetKey) {
                throw Exception("Password reset keys do not match.")
            }

            AdministratorsRepository.changePassword(user, newPassword)
        }
        return true
    }
}
