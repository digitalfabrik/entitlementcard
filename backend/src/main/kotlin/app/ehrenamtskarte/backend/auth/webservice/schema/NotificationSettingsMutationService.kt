package app.ehrenamtskarte.backend.auth.webservice.schema

import app.ehrenamtskarte.backend.auth.database.repos.AdministratorsRepository
import app.ehrenamtskarte.backend.auth.getAuthContext
import app.ehrenamtskarte.backend.auth.webservice.schema.types.NotificationSettings
import app.ehrenamtskarte.backend.common.webservice.context
import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import graphql.schema.DataFetchingEnvironment
import org.jetbrains.exposed.sql.transactions.transaction

@Suppress("unused")
class NotificationSettingsMutationService {
    @GraphQLDescription("Updates the notification settings")
    fun updateNotificationSettings(notificationSettings: NotificationSettings, dfe: DataFetchingEnvironment): Boolean {
        val context = dfe.graphQlContext.context
        val admin = context.getAuthContext().admin

        transaction {
            AdministratorsRepository.updateNotificationSettings(admin, notificationSettings)
        }
        return true
    }
}
