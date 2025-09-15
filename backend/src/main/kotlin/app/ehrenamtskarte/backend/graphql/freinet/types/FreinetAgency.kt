package app.ehrenamtskarte.backend.graphql.freinet.types

data class FreinetAgency(
    val agencyId: Int,
    val agencyName: String,
    val apiAccessKey: String,
    val dataTransferActivated: Boolean,
)
