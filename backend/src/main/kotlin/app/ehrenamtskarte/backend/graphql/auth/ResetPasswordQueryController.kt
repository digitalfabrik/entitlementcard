package app.ehrenamtskarte.backend.graphql.auth

import app.ehrenamtskarte.backend.db.entities.AdministratorEntity
import app.ehrenamtskarte.backend.db.entities.Administrators
import app.ehrenamtskarte.backend.db.entities.ProjectEntity
import app.ehrenamtskarte.backend.db.entities.Projects
import app.ehrenamtskarte.backend.graphql.exceptions.InvalidPasswordResetLinkException
import app.ehrenamtskarte.backend.graphql.exceptions.PasswordResetKeyExpiredException
import app.ehrenamtskarte.backend.shared.crypto.PasswordCrypto
import app.ehrenamtskarte.backend.shared.exceptions.ProjectNotFoundException
import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import org.jetbrains.exposed.v1.core.and
import org.jetbrains.exposed.v1.core.eq
import org.jetbrains.exposed.v1.core.isNotNull
import org.jetbrains.exposed.v1.core.not
import org.jetbrains.exposed.v1.jdbc.transactions.transaction
import org.springframework.graphql.data.method.annotation.Argument
import org.springframework.graphql.data.method.annotation.QueryMapping
import org.springframework.stereotype.Controller
import java.time.Instant

@Controller
class ResetPasswordQueryController {
    @GraphQLDescription("Verify password reset link")
    @QueryMapping
    fun checkPasswordResetLink(
        @Argument project: String,
        @Argument resetKey: String,
    ): Boolean =
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
