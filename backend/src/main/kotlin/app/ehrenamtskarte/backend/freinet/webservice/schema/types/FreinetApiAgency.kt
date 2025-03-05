package app.ehrenamtskarte.backend.freinet.webservice.schema.types

data class FreinetApiAgency(
    val officialRegionalKeys: List<String>,
    val agencyId: Int,
    val agencyName: String,
    val apiAccessKey: String
)
