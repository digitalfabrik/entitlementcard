package app.ehrenamtskarte.backend.application.webservice.schema.view

data class ApplicationVerificationView(
    val contactName: String,
    val contactEmailAddress: String,
    val organizationName: String,
)
