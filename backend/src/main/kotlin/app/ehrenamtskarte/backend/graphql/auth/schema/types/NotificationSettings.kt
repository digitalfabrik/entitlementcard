package app.ehrenamtskarte.backend.graphql.auth.schema.types

data class NotificationSettings(
    val notificationOnApplication: Boolean,
    val notificationOnVerification: Boolean,
)
