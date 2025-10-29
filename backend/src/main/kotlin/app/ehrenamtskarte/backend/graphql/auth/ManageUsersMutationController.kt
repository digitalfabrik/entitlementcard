package app.ehrenamtskarte.backend.graphql.auth

import app.ehrenamtskarte.backend.config.BackendConfiguration
import app.ehrenamtskarte.backend.db.entities.AdministratorEntity
import app.ehrenamtskarte.backend.db.entities.mayCreateUser
import app.ehrenamtskarte.backend.db.entities.mayDeleteUser
import app.ehrenamtskarte.backend.db.entities.mayEditUser
import app.ehrenamtskarte.backend.db.repositories.AdministratorsRepository
import app.ehrenamtskarte.backend.db.repositories.RegionsRepository
import app.ehrenamtskarte.backend.graphql.auth.types.Role
import app.ehrenamtskarte.backend.graphql.exceptions.EmailAlreadyExistsException
import app.ehrenamtskarte.backend.graphql.exceptions.RegionNotFoundException
import app.ehrenamtskarte.backend.shared.exceptions.ForbiddenException
import app.ehrenamtskarte.backend.shared.exceptions.UnauthorizedException
import app.ehrenamtskarte.backend.shared.mail.Mailer
import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import graphql.schema.DataFetchingEnvironment
import org.jetbrains.exposed.sql.transactions.transaction
import org.springframework.graphql.data.method.annotation.Argument
import org.springframework.graphql.data.method.annotation.MutationMapping
import org.springframework.stereotype.Controller

@Controller
class ManageUsersMutationController(
    @Suppress("SpringJavaInjectionPointsAutowiringInspection")
    private val backendConfig: BackendConfiguration,
) {
    @GraphQLDescription("Creates a new administrator")
    @MutationMapping
    fun createAdministrator(
        @Argument email: String,
        @Argument role: Role,
        @Argument regionId: Int?,
        @Argument sendWelcomeMail: Boolean,
        dfe: DataFetchingEnvironment,
    ): Boolean {
        val authContext = dfe.requireAuthContext()
        val projectConfig = backendConfig.getProjectConfig(authContext.project)

        transaction {
            val region = regionId?.let {
                RegionsRepository.findByIdInProject(authContext.project, it) ?: throw RegionNotFoundException()
            }

            if (!authContext.admin.mayCreateUser(authContext.projectId, role, region)) {
                throw ForbiddenException()
            }

            if (AdministratorsRepository.emailAlreadyExists(email)) {
                throw EmailAlreadyExistsException()
            }

            val newUser = AdministratorsRepository.insert(authContext.project, email, null, role, regionId)

            if (sendWelcomeMail) {
                val key = AdministratorsRepository.setNewPasswordResetKey(newUser)
                Mailer.sendWelcomeMail(
                    backendConfig,
                    projectConfig,
                    key,
                    email,
                )
            }
        }
        return true
    }

    @GraphQLDescription("Edits an existing administrator")
    @MutationMapping
    fun editAdministrator(
        @Argument adminId: Int,
        @Argument newEmail: String,
        @Argument newRole: Role,
        @Argument newRegionId: Int?,
        dfe: DataFetchingEnvironment,
    ): Boolean {
        val authContext = dfe.requireAuthContext()

        transaction {
            val adminToEdit = AdministratorEntity.findById(adminId) ?: throw UnauthorizedException()
            val newRegion = newRegionId?.let { RegionsRepository.findByIdInProject(authContext.project, it) }

            if (!authContext.admin.mayEditUser(adminToEdit, authContext.projectId, newRole, newRegion)) {
                throw ForbiddenException()
            }

            if (newEmail != adminToEdit.email && AdministratorsRepository.emailAlreadyExists(newEmail)) {
                throw EmailAlreadyExistsException()
            }

            adminToEdit.email = newEmail
            adminToEdit.role = newRole.db_value
            adminToEdit.regionId = newRegion?.id
        }
        return true
    }

    @GraphQLDescription("Deletes an existing administrator")
    @MutationMapping
    fun deleteAdministrator(
        @Argument adminId: Int,
        dfe: DataFetchingEnvironment,
    ): Boolean {
        val authContext = dfe.requireAuthContext()

        transaction {
            val adminToDelete = AdministratorEntity.findById(adminId) ?: throw UnauthorizedException()

            if (!authContext.admin.mayDeleteUser(adminToDelete)) {
                throw ForbiddenException()
            }

            AdministratorsRepository.deleteAdministrator(adminToDelete)
        }
        return true
    }
}
