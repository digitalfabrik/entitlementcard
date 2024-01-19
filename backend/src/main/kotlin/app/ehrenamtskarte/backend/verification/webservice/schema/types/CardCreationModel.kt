package app.ehrenamtskarte.backend.verification.webservice.schema.types

data class CardCreationModel constructor(
    val encodedCardInfoBase64: String,
    val generateDynamicActivationCode: Boolean,
    val generateStaticVerificationCode: Boolean
)
