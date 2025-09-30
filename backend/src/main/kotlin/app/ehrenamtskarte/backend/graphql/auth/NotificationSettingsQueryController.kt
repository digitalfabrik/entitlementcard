package app.ehrenamtskarte.backend.graphql.auth

import app.ehrenamtskarte.backend.graphql.auth.types.NotificationSettings
import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import graphql.schema.DataFetchingEnvironment
import org.springframework.graphql.data.method.annotation.QueryMapping
import org.springframework.stereotype.Controller

@Controller
class NotificationSettingsQueryController {
    @GraphQLDescription("Get the notification settings of the authenticated administrator")
    @QueryMapping
    fun getNotificationSettings(dfe: DataFetchingEnvironment): NotificationSettings {
        val admin = dfe.requireAuthContext().admin
        return NotificationSettings(admin.notificationOnApplication, admin.notificationOnVerification)
    }
}
