package app.ehrenamtskarte.backend.freinet.webservice.schema.types

data class FreinetCard(
    val id: Int,
    val expirationDate: String?,
    val cardType: String,
)
