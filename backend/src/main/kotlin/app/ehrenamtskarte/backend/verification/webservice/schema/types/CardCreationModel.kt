package app.ehrenamtskarte.backend.verification.webservice.schema.types

data class CardCreationModel(
    val encodedCardInfoBase64: String,
    val generateStaticCodes: Boolean
)
