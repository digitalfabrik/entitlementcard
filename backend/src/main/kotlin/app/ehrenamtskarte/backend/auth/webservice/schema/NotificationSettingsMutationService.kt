package app.ehrenamtskarte.backend.auth.webservice.schema

import app.ehrenamtskarte.backend.auth.database.repos.AdministratorsRepository
import app.ehrenamtskarte.backend.auth.getAdministrator
import app.ehrenamtskarte.backend.auth.webservice.schema.types.NotificationSettings
import app.ehrenamtskarte.backend.common.webservice.context
import app.ehrenamtskarte.backend.exception.service.ProjectNotFoundException
import app.ehrenamtskarte.backend.exception.service.UnauthorizedException
import app.ehrenamtskarte.backend.projects.database.ProjectEntity
import app.ehrenamtskarte.backend.projects.database.Projects
import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import graphql.schema.DataFetchingEnvironment
import org.jetbrains.exposed.sql.transactions.transaction

@Suppress("unused")
class NotificationSettingsMutationService {
    @GraphQLDescription("Updates the notification settings")
    fun updateNotificationSettings(
        project: String,
        notificationSettings: NotificationSettings,
        dfe: DataFetchingEnvironment,
    ): Boolean {
        val context = dfe.graphQlContext.context
        val admin = context.getAdministrator()

        transaction {
            val projectEntity = ProjectEntity
                .find { Projects.project eq project }
                .firstOrNull()
                ?: throw ProjectNotFoundException(project)

            if (admin.projectId != projectEntity.id) throw UnauthorizedException()

            AdministratorsRepository.updateNotificationSettings(admin, notificationSettings)
        }
        return true
    }
}
