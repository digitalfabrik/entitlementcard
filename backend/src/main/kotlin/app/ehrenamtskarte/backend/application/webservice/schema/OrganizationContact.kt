package app.ehrenamtskarte.backend.application.webservice.schema

data class OrganizationContact(
    val name: String,
    val telephone: String,
    val email: String,
    val hasGivenPermission: Boolean
)
