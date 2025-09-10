package app.ehrenamtskarte.backend.graphql.auth.types

data class NotificationSettings(
    val notificationOnApplication: Boolean,
    val notificationOnVerification: Boolean,
)
