package app.ehrenamtskarte.backend.application.webservice.schema.create

data class OrganizationContact(
    val name: String,
    val telephone: String,
    val email: String,
    val hasGivenPermission: Boolean
)
