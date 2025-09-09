package app.ehrenamtskarte.backend.graphql.auth.schema

import app.ehrenamtskarte.backend.db.entities.AdministratorEntity
import app.ehrenamtskarte.backend.db.entities.mayCreateUser
import app.ehrenamtskarte.backend.db.entities.mayDeleteUser
import app.ehrenamtskarte.backend.db.entities.mayEditUser
import app.ehrenamtskarte.backend.db.repositories.AdministratorsRepository
import app.ehrenamtskarte.backend.db.repositories.RegionsRepository
import app.ehrenamtskarte.backend.exception.service.ForbiddenException
import app.ehrenamtskarte.backend.exception.service.UnauthorizedException
import app.ehrenamtskarte.backend.graphql.auth.schema.types.Role
import app.ehrenamtskarte.backend.graphql.shared.exceptions.EmailAlreadyExistsException
import app.ehrenamtskarte.backend.graphql.shared.exceptions.RegionNotFoundException
import app.ehrenamtskarte.backend.graphql.getAuthContext
import app.ehrenamtskarte.backend.graphql.shared.context
import app.ehrenamtskarte.backend.shared.mail.Mailer
import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import graphql.schema.DataFetchingEnvironment
import org.jetbrains.exposed.sql.transactions.transaction

@Suppress("unused")
class ManageUsersMutationService {
    @GraphQLDescription("Creates a new administrator")
    fun createAdministrator(
        email: String,
        role: Role,
        regionId: Int?,
        sendWelcomeMail: Boolean,
        dfe: DataFetchingEnvironment,
    ): Boolean {
        val context = dfe.graphQlContext.context
        val authContext = context.getAuthContext()
        val backendConfig = context.backendConfiguration
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
    fun editAdministrator(
        adminId: Int,
        newEmail: String,
        newRole: Role,
        newRegionId: Int?,
        dfe: DataFetchingEnvironment,
    ): Boolean {
        val context = dfe.graphQlContext.context
        val authContext = context.getAuthContext()

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
    fun deleteAdministrator(adminId: Int, dfe: DataFetchingEnvironment): Boolean {
        val authContext = dfe.graphQlContext.context.getAuthContext()

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
