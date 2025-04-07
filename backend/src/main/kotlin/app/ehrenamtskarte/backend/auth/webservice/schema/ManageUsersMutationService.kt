package app.ehrenamtskarte.backend.auth.webservice.schema

import app.ehrenamtskarte.backend.auth.database.AdministratorEntity
import app.ehrenamtskarte.backend.auth.database.repos.AdministratorsRepository
import app.ehrenamtskarte.backend.auth.getAdministrator
import app.ehrenamtskarte.backend.auth.service.Authorizer
import app.ehrenamtskarte.backend.auth.webservice.schema.types.Role
import app.ehrenamtskarte.backend.common.webservice.GraphQLContext
import app.ehrenamtskarte.backend.exception.service.ForbiddenException
import app.ehrenamtskarte.backend.exception.service.ProjectNotFoundException
import app.ehrenamtskarte.backend.exception.service.UnauthorizedException
import app.ehrenamtskarte.backend.exception.webservice.exceptions.EmailAlreadyExistsException
import app.ehrenamtskarte.backend.exception.webservice.exceptions.RegionNotFoundException
import app.ehrenamtskarte.backend.mail.Mailer
import app.ehrenamtskarte.backend.projects.database.ProjectEntity
import app.ehrenamtskarte.backend.projects.database.Projects
import app.ehrenamtskarte.backend.regions.database.repos.RegionsRepository
import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import graphql.schema.DataFetchingEnvironment
import org.jetbrains.exposed.sql.transactions.transaction

@Suppress("unused")
class ManageUsersMutationService {
    @GraphQLDescription("Creates a new administrator")
    fun createAdministrator(
        project: String,
        email: String,
        role: Role,
        regionId: Int?,
        sendWelcomeMail: Boolean,
        dfe: DataFetchingEnvironment,
    ): Boolean {
        val context = dfe.getContext<GraphQLContext>()
        val actingAdmin = context.getAdministrator()
        val backendConfig = context.backendConfiguration
        val projectConfig = backendConfig.projects.first { it.id == project }

        transaction {
            val projectEntity = ProjectEntity
                .find { Projects.project eq project }
                .singleOrNull()
                ?: throw ProjectNotFoundException(project)
            val region = regionId?.let {
                RegionsRepository.findByIdInProject(project, it) ?: throw RegionNotFoundException()
            }

            if (!Authorizer.mayCreateUser(actingAdmin, projectEntity.id.value, role, region)) {
                throw ForbiddenException()
            }

            if (AdministratorsRepository.emailAlreadyExists(email)) {
                throw EmailAlreadyExistsException()
            }

            val newUser = AdministratorsRepository.insert(project, email, null, role, regionId)

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
        project: String,
        adminId: Int,
        newEmail: String,
        newRole: Role,
        newRegionId: Int?,
        dfe: DataFetchingEnvironment,
    ): Boolean {
        val context = dfe.getContext<GraphQLContext>()
        val actingAdmin = context.getAdministrator()

        transaction {
            val existingAdmin = AdministratorEntity.findById(adminId) ?: throw UnauthorizedException()

            val projectEntity = ProjectEntity.find { Projects.project eq project }.firstOrNull()
                ?: throw ProjectNotFoundException(project)
            val newRegion = newRegionId?.let { RegionsRepository.findByIdInProject(project, it) }

            if (!Authorizer.mayEditUser(
                    actingAdmin,
                    existingAdmin,
                    projectEntity.id.value,
                    newRole,
                    newRegion,
                )
            ) {
                throw ForbiddenException()
            }

            if (
                newEmail != existingAdmin.email &&
                AdministratorsRepository.emailAlreadyExists(newEmail)
            ) {
                throw EmailAlreadyExistsException()
            }

            existingAdmin.email = newEmail
            existingAdmin.role = newRole.db_value
            existingAdmin.regionId = newRegion?.id
        }
        return true
    }

    @GraphQLDescription("Deletes an existing administrator")
    fun deleteAdministrator(project: String, adminId: Int, dfe: DataFetchingEnvironment): Boolean {
        val context = dfe.getContext<GraphQLContext>()
        val actingAdmin = context.getAdministrator()

        transaction {
            val existingAdmin = AdministratorEntity.findById(adminId) ?: throw UnauthorizedException()
            val projectEntity = ProjectEntity.find {
                Projects.project eq project
            }.firstOrNull() ?: throw ProjectNotFoundException(project)

            if (existingAdmin.projectId != projectEntity.id) throw UnauthorizedException()

            if (!Authorizer.mayDeleteUser(actingAdmin, existingAdmin)) {
                throw ForbiddenException()
            }

            AdministratorsRepository.deleteAdministrator(existingAdmin)
        }
        return true
    }
}
