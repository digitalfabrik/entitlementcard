package app.ehrenamtskarte.backend.verification.webservice.schema.types

data class CardGenerationModel constructor(
    val cardDetailsHashBase64: String,
    val totpSecretBase64: String,
    // Using long because UInt is not supported
    val cardExpirationDay: Int,
    val regionId: Int
)
