package app.ehrenamtskarte.backend.verification.webservice.schema.types

data class CardCreationResultModel constructor(
    val dynamicActivationCodeBase64: String?,
    val staticVerificationCodeBase64: String?,
)