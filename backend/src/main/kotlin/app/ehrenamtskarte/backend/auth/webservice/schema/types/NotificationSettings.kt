package app.ehrenamtskarte.backend.auth.webservice.schema.types

data class NotificationSettings(
    val notificationOnApplication: Boolean,
    val notificationOnVerification: Boolean,
)
