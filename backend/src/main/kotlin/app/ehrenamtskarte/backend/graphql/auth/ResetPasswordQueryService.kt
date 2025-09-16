package app.ehrenamtskarte.backend.graphql.auth

import app.ehrenamtskarte.backend.db.entities.AdministratorEntity
import app.ehrenamtskarte.backend.db.entities.Administrators
import app.ehrenamtskarte.backend.db.entities.ProjectEntity
import app.ehrenamtskarte.backend.db.entities.Projects
import app.ehrenamtskarte.backend.graphql.shared.exceptions.InvalidPasswordResetLinkException
import app.ehrenamtskarte.backend.graphql.shared.exceptions.PasswordResetKeyExpiredException
import app.ehrenamtskarte.backend.shared.crypto.PasswordCrypto
import app.ehrenamtskarte.backend.shared.exceptions.ProjectNotFoundException
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
