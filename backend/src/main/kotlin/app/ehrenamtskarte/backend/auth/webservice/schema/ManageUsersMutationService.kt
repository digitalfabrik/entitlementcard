package app.ehrenamtskarte.backend.auth.webservice.schema

import app.ehrenamtskarte.backend.auth.database.AdministratorEntity
import app.ehrenamtskarte.backend.auth.database.repos.AdministratorsRepository
import app.ehrenamtskarte.backend.auth.getAuthContext
import app.ehrenamtskarte.backend.auth.service.Authorizer
import app.ehrenamtskarte.backend.auth.webservice.schema.types.Role
import app.ehrenamtskarte.backend.common.webservice.context
import app.ehrenamtskarte.backend.exception.service.ForbiddenException
import app.ehrenamtskarte.backend.exception.service.UnauthorizedException
import app.ehrenamtskarte.backend.exception.webservice.exceptions.EmailAlreadyExistsException
import app.ehrenamtskarte.backend.exception.webservice.exceptions.RegionNotFoundException
import app.ehrenamtskarte.backend.mail.Mailer
import app.ehrenamtskarte.backend.regions.database.repos.RegionsRepository
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
        val projectConfig = backendConfig.getProjectConfig(authContext.projectName)

        transaction {
            val region = regionId?.let {
                RegionsRepository.findByIdInProject(authContext.projectName, it) ?: throw RegionNotFoundException()
            }

            if (!Authorizer.mayCreateUser(authContext.admin, authContext.admin.projectId.value, role, region)) {
                throw ForbiddenException()
            }

            if (AdministratorsRepository.emailAlreadyExists(email)) {
                throw EmailAlreadyExistsException()
            }

            val newUser = AdministratorsRepository.insert(authContext.projectName, email, null, role, regionId)

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
            val newRegion = newRegionId?.let { RegionsRepository.findByIdInProject(authContext.projectName, it) }

            if (!Authorizer.mayEditUser(
                    authContext.admin,
                    adminToEdit,
                    authContext.admin.projectId.value,
                    newRole,
                    newRegion,
                )
            ) {
                throw ForbiddenException()
            }

            if (
                newEmail != adminToEdit.email &&
                AdministratorsRepository.emailAlreadyExists(newEmail)
            ) {
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

            if (!Authorizer.mayDeleteUser(authContext.admin, adminToDelete)) {
                throw ForbiddenException()
            }

            AdministratorsRepository.deleteAdministrator(adminToDelete)
        }
        return true
    }
}
