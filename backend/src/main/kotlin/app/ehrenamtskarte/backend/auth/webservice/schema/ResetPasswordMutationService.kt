package app.ehrenamtskarte.backend.auth.webservice.schema

import app.ehrenamtskarte.backend.auth.database.AdministratorEntity
import app.ehrenamtskarte.backend.auth.database.Administrators
import app.ehrenamtskarte.backend.auth.database.repos.AdministratorsRepository
import app.ehrenamtskarte.backend.mail.sendMail
import app.ehrenamtskarte.backend.projects.database.Projects
import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.and
import org.jetbrains.exposed.sql.select
import org.jetbrains.exposed.sql.transactions.transaction

@Suppress("unused")
class ResetPasswordMutationService {
    @GraphQLDescription("Sends a mail that allows the administrator to reset their password.")
    fun sendResetMail(project: String, email: String): Boolean {
        val user = transaction {
            Administrators.innerJoin(Projects).slice(Administrators.columns)
                .select((Projects.project eq project) and (Administrators.email eq email))
                .single().let { AdministratorEntity.wrapRow(it) }
        }

        val key = AdministratorsRepository.setNewPasswordResetKey(user)

        sendMail(email, generateResetMail(key))

        return true
    }

    private fun generateResetMail(key: String): String {
        return """
            Guten Tag.
            
            Sie haben angefragt, Ihr Passwort zurückzusetzen.
            Sie können Ihr Passwort unter dem folgenden Link zurücksetzen:
            http://localhost:3000/reset-password/$key
            
            Mit freundlichen Grüßen,
            Ihr Ehrenamtskarten Team
        """.trimIndent()
    }

    @GraphQLDescription("Reset the administrator's password")
    fun resetPassword(project: String, email: String, passwordResetKey: String, newPassword: String): Boolean {
        return true
    }
}
