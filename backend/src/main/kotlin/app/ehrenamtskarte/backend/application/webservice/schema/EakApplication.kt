package app.ehrenamtskarte.backend.application.webservice.schema

data class EakApplication(
    val forename: String,
    val surname: String,
    val organisations: List<EakOrganisation>
)
