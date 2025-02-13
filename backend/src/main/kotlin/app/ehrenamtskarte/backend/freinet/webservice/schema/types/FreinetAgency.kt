package app.ehrenamtskarte.backend.freinet.webservice.schema.types

data class FreinetAgency(
    val agencyId: Int,
    val apiAccessKey: String,
    val dataTransferActivated: Boolean
)
