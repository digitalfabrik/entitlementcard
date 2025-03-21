package app.ehrenamtskarte.backend.auth.webservice.schema

import app.ehrenamtskarte.backend.auth.getAdministrator
import app.ehrenamtskarte.backend.auth.webservice.schema.types.NotificationSettings
import app.ehrenamtskarte.backend.common.webservice.GraphQLContext
import app.ehrenamtskarte.backend.exception.service.ProjectNotFoundException
import app.ehrenamtskarte.backend.exception.service.UnauthorizedException
import app.ehrenamtskarte.backend.projects.database.ProjectEntity
import app.ehrenamtskarte.backend.projects.database.Projects
import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import graphql.schema.DataFetchingEnvironment
import org.jetbrains.exposed.sql.transactions.transaction

@Suppress("unused")
class NotificationSettingsQueryService {
    @GraphQLDescription("Get the notification settings of the authenticated administrator")
    fun getNotificationSettings(
        project: String,
        dfe: DataFetchingEnvironment
    ): NotificationSettings {
        val context = dfe.getContext<GraphQLContext>()
        val admin = context.getAdministrator()

        return transaction {
            val projectEntity =
                ProjectEntity.find { Projects.project eq project }.firstOrNull()
                    ?: throw ProjectNotFoundException(project)

            if (admin.projectId != projectEntity.id) throw UnauthorizedException()

            NotificationSettings(admin.notificationOnApplication, admin.notificationOnVerification)
        }
    }
}
