package app.ehrenamtskarte.backend.graphql.auth.schema

import app.ehrenamtskarte.backend.shared.webservice.context
import app.ehrenamtskarte.backend.graphql.auth.schema.types.NotificationSettings
import app.ehrenamtskarte.backend.graphql.getAuthContext
import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import graphql.schema.DataFetchingEnvironment

@Suppress("unused")
class NotificationSettingsQueryService {
    @GraphQLDescription("Get the notification settings of the authenticated administrator")
    fun getNotificationSettings(dfe: DataFetchingEnvironment): NotificationSettings {
        val context = dfe.graphQlContext.context
        val admin = context.getAuthContext().admin

        return NotificationSettings(admin.notificationOnApplication, admin.notificationOnVerification)
    }
}
