package app.ehrenamtskarte.backend.auth.webservice.schema

import app.ehrenamtskarte.backend.auth.database.AdministratorEntity
import app.ehrenamtskarte.backend.auth.database.Administrators
import app.ehrenamtskarte.backend.auth.webservice.schema.types.Administrator
import app.ehrenamtskarte.backend.projects.database.ProjectEntity
import app.ehrenamtskarte.backend.projects.database.Projects
import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import org.jetbrains.exposed.sql.and
import org.jetbrains.exposed.sql.transactions.transaction
import java.time.LocalDateTime

@Suppress("unused")
class ResetPasswordQueryService {
    @GraphQLDescription("Verify password reset link")
    fun checkPasswordResetLink(project: String, resetKey: String): Administrator {
        return transaction {
            val projectId = ProjectEntity.find { Projects.project eq project }.single().id.value
            val admin = AdministratorEntity
                .find { Administrators.passwordResetKey eq resetKey and (Administrators.projectId eq projectId) }.single()
            if (admin.passwordResetKeyExpiry!!.isBefore(LocalDateTime.now())) {
                throw Exception("Password reset key has expired.")
            }
            Administrator.fromDbEntity(admin)
        }
    }
}
