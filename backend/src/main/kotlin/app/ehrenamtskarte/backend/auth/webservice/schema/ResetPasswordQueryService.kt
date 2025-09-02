package app.ehrenamtskarte.backend.auth.webservice.schema

import app.ehrenamtskarte.backend.db.entities.AdministratorEntity
import app.ehrenamtskarte.backend.db.entities.Administrators
import app.ehrenamtskarte.backend.auth.database.PasswordCrypto
import app.ehrenamtskarte.backend.exception.service.ProjectNotFoundException
import app.ehrenamtskarte.backend.exception.webservice.exceptions.InvalidPasswordResetLinkException
import app.ehrenamtskarte.backend.exception.webservice.exceptions.PasswordResetKeyExpiredException
import app.ehrenamtskarte.backend.db.entities.ProjectEntity
import app.ehrenamtskarte.backend.db.entities.Projects
import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import org.jetbrains.exposed.sql.and
import org.jetbrains.exposed.sql.not
import org.jetbrains.exposed.sql.transactions.transaction
import java.time.Instant

@Suppress("unused")
class ResetPasswordQueryService {
    @GraphQLDescription("Verify password reset link")
    fun checkPasswordResetLink(project: String, resetKey: String): Boolean =
        transaction {
            val projectEntity =
                ProjectEntity.find { Projects.project eq project }.firstOrNull() ?: throw ProjectNotFoundException(
                    project,
                )
            val projectId = projectEntity.id.value
            val admin = AdministratorEntity
                .find {
                    Administrators.passwordResetKeyHash.isNotNull() and (Administrators.projectId eq projectId) and not(
                        Administrators.deleted,
                    )
                }.firstOrNull {
                    PasswordCrypto.verifyPasswordResetKey(
                        resetKey,
                        it.passwordResetKeyHash!!,
                    )
                }
            if (admin == null) {
                throw InvalidPasswordResetLinkException()
            } else if (admin.passwordResetKeyExpiry!!.isBefore(Instant.now())) {
                throw PasswordResetKeyExpiredException()
            }
            true
        }
}
