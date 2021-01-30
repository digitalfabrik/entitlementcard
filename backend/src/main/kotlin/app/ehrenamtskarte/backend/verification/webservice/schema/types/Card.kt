package app.ehrenamtskarte.backend.verification.webservice.schema.types

data class Card constructor(
    val totpSecretBase64: String,
    val expirationDate: Long,
    val hashModelBase64: String
) {

}

