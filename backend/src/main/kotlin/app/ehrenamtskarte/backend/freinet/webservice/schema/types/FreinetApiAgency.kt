package app.ehrenamtskarte.backend.freinet.webservice.schema.types

data class FreinetApiAgency(
    val arsList: List<String>,
    val agencyId: Int,
    val apiAccessKey: String
)
