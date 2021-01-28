package app.ehrenamtskarte.backend.verification.webservice.schema.types

data class Card constructor(
    val totpSecret: List<Short>,
    val expirationDate: Long,
    val hashModel: String
) {

}

