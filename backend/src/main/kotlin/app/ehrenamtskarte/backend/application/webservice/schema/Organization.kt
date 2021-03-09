package app.ehrenamtskarte.backend.application.webservice.schema

data class Organization(
    val name: String,
    val contact: OrganizationContact
)
