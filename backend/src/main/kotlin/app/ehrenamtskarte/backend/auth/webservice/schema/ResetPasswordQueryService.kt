package app.ehrenamtskarte.backend.auth.webservice.schema

import app.ehrenamtskarte.backend.auth.database.AdministratorEntity
import app.ehrenamtskarte.backend.auth.database.Administrators
import app.ehrenamtskarte.backend.projects.database.ProjectEntity
import app.ehrenamtskarte.backend.projects.database.Projects
import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import graphql.GraphqlErrorException
import org.jetbrains.exposed.sql.and
import org.jetbrains.exposed.sql.not
import org.jetbrains.exposed.sql.transactions.transaction
import java.time.Instant

class PasswordResetKeyExpiredException() : GraphqlErrorException(
    newErrorException().extensions(
        mapOf(
            Pair("code", "PASSWORD_RESET_KEY_EXPIRED")
        )
    )
)

class InvalidPasswordResetLinkException() : GraphqlErrorException(
    newErrorException().extensions(
        mapOf(
            Pair("code", "INVALID_PASSWORD_RESET_LINK")
        )
    )
)

@Suppress("unused")
class ResetPasswordQueryService {
    @GraphQLDescription("Verify password reset link")
    fun checkPasswordResetLink(project: String, resetKey: String): Boolean {
        return transaction {
            val projectId = ProjectEntity.find { Projects.project eq project }.single().id.value
            val admin = AdministratorEntity
                .find { Administrators.passwordResetKey eq resetKey and (Administrators.projectId eq projectId) and not(Administrators.deleted) }.singleOrNull()
            if (admin == null) {
                throw InvalidPasswordResetLinkException()
            } else if (admin.passwordResetKeyExpiry!!.isBefore(Instant.now())) {
                throw PasswordResetKeyExpiredException()
            }
            true
        }
    }
}
