package app.ehrenamtskarte.backend.regions.webservice.schema.types

data class FreinetAgency(
    val arsList: List<String>,
    val agencyId: Int,
    val apiAccessKey: String
)
