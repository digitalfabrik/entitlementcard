package app.ehrenamtskarte.backend.auth.webservice.schema

import app.ehrenamtskarte.backend.auth.database.AdministratorEntity
import app.ehrenamtskarte.backend.auth.database.repos.AdministratorsRepository
import app.ehrenamtskarte.backend.auth.service.Authorizer
import app.ehrenamtskarte.backend.auth.webservice.schema.types.Role
import app.ehrenamtskarte.backend.common.webservice.GraphQLContext
import app.ehrenamtskarte.backend.common.webservice.UnauthorizedException
import app.ehrenamtskarte.backend.mail.Mailer
import app.ehrenamtskarte.backend.projects.database.ProjectEntity
import app.ehrenamtskarte.backend.projects.database.Projects
import app.ehrenamtskarte.backend.regions.database.RegionEntity
import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import graphql.GraphqlErrorException
import graphql.schema.DataFetchingEnvironment
import org.jetbrains.exposed.sql.transactions.transaction
import java.net.URLEncoder
import java.nio.charset.StandardCharsets

class EmailAlreadyExistsException() : GraphqlErrorException(
    newErrorException().extensions(
        mapOf(
            Pair("code", "EMAIL_ALREADY_EXISTS"),
        ),
    ),
)

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
        val jwtPayload = context.enforceSignedIn()
        val projectConfig = context.backendConfiguration.projects.first { it.id == project }

        transaction {
            val actingAdmin = AdministratorEntity.findById(jwtPayload.adminId) ?: throw UnauthorizedException()

            val projectEntity = ProjectEntity.find { Projects.project eq project }.first()
            val region = regionId?.let { RegionEntity.findById(it) }

            if (!Authorizer.mayCreateUser(actingAdmin, projectEntity.id.value, role, region)) {
                throw UnauthorizedException()
            }

            if (AdministratorsRepository.emailAlreadyExists(email)) {
                throw EmailAlreadyExistsException()
            }

            val newUser = AdministratorsRepository.insert(project, email, null, role, regionId)

            if (sendWelcomeMail) {
                val key = AdministratorsRepository.setNewPasswordResetKey(newUser)
                Mailer.sendMail(
                    context.backendConfiguration,
                    projectConfig.smtp,
                    projectConfig.administrationName,
                    email,
                    "Kontoerstellung",
                    generateWelcomeMailMessage(
                        key,
                        projectConfig.administrationName,
                        projectConfig.administrationBaseUrl,
                    ),
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
        val jwtPayload = context.enforceSignedIn()

        transaction {
            val actingAdmin = AdministratorEntity.findById(jwtPayload.adminId) ?: throw UnauthorizedException()
            val existingAdmin = AdministratorEntity.findById(adminId) ?: throw UnauthorizedException()

            val projectEntity = ProjectEntity.find { Projects.project eq project }.first()
            val newRegion = newRegionId?.let { RegionEntity.findById(it) }

            if (!Authorizer.mayEditUser(actingAdmin, existingAdmin, projectEntity.id.value, newRole, newRegion)) {
                throw UnauthorizedException()
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
    fun deleteAdministrator(
        project: String,
        adminId: Int,
        dfe: DataFetchingEnvironment,
    ): Boolean {
        val context = dfe.getContext<GraphQLContext>()
        val jwtPayload = context.enforceSignedIn()

        transaction {
            val actingAdmin = AdministratorEntity.findById(jwtPayload.adminId) ?: throw UnauthorizedException()
            val existingAdmin = AdministratorEntity.findById(adminId) ?: throw UnauthorizedException()
            val projectEntity = ProjectEntity.find { Projects.project eq project }.first()

            if (existingAdmin.projectId != projectEntity.id) throw UnauthorizedException()

            if (!Authorizer.mayDeleteUser(actingAdmin, existingAdmin)) {
                throw UnauthorizedException()
            }

            AdministratorsRepository.deleteAdministrator(existingAdmin)
        }
        return true
    }

    private fun generateWelcomeMailMessage(
        key: String,
        administrationName: String,
        administrationBaseUrl: String,
    ): String {
        return """
            Guten Tag,
            
            für Sie wurde ein Account für $administrationName erstellt.
            Sie können Ihr Passwort unter dem folgenden Link setzen:
            $administrationBaseUrl/reset-password/${URLEncoder.encode(key, StandardCharsets.UTF_8)}
            
            Dieser Link ist 24 Stunden gültig.
            
            Dies ist eine automatisierte Nachricht. Antworten Sie nicht auf diese Email.
            
            - $administrationName
        """.trimIndent()
    }
}
