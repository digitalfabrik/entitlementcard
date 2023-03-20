package app.ehrenamtskarte.backend.auth.webservice.schema

import app.ehrenamtskarte.backend.auth.database.AdministratorEntity
import app.ehrenamtskarte.backend.auth.database.Administrators
import app.ehrenamtskarte.backend.auth.webservice.schema.types.Administrator
import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import org.jetbrains.exposed.sql.transactions.transaction
import java.time.LocalDateTime

@Suppress("unused")
class ResetPasswordQueryService {
    @GraphQLDescription("Verify password reset link")
    fun checkPasswordResetLink(resetKey: String): Administrator {
        return transaction {
            val admin = AdministratorEntity.find { Administrators.passwordResetKey eq resetKey }.single()
            if (admin.passwordResetKeyExpiry!!.isBefore(LocalDateTime.now())) {
                throw Exception("Password reset key has expired.")
            }
            Administrator.fromDbEntity(admin)
        }
    }
}
