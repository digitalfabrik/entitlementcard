package app.ehrenamtskarte.backend.graphql.auth.schema

import app.ehrenamtskarte.backend.shared.webservice.context
import app.ehrenamtskarte.backend.db.repositories.AdministratorsRepository
import app.ehrenamtskarte.backend.graphql.auth.schema.types.NotificationSettings
import app.ehrenamtskarte.backend.graphql.getAuthContext
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
