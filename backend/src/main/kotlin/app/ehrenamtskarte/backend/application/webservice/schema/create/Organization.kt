package app.ehrenamtskarte.backend.application.webservice.schema.create

data class Organization(
    val name: String,
    val contact: OrganizationContact
)
