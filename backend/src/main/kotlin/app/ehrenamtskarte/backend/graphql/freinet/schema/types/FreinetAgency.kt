package app.ehrenamtskarte.backend.graphql.freinet.schema.types

data class FreinetAgency(
    val agencyId: Int,
    val agencyName: String,
    val apiAccessKey: String,
    val dataTransferActivated: Boolean,
)
