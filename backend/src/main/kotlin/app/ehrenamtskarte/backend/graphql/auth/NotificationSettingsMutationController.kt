package app.ehrenamtskarte.backend.graphql.auth

import app.ehrenamtskarte.backend.db.repositories.AdministratorsRepository
import app.ehrenamtskarte.backend.graphql.auth.types.NotificationSettings
import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import graphql.schema.DataFetchingEnvironment
import org.jetbrains.exposed.sql.transactions.transaction
import org.springframework.graphql.data.method.annotation.Argument
import org.springframework.graphql.data.method.annotation.MutationMapping
import org.springframework.stereotype.Controller

@Controller
class NotificationSettingsMutationController {
    @GraphQLDescription("Updates the notification settings")
    @MutationMapping
    fun updateNotificationSettings(
        @Argument notificationSettings: NotificationSettings,
        dfe: DataFetchingEnvironment,
    ): Boolean {
        val admin = dfe.requireAuthContext().admin

        transaction {
            AdministratorsRepository.updateNotificationSettings(admin, notificationSettings)
        }
        return true
    }
}
