package app.ehrenamtskarte.backend.freinet.webservice.schema.types

data class FreinetAgency(
    val agencyId: Int,
    val agencyName: String,
    val apiAccessKey: String,
    val dataTransferActivated: Boolean
)
