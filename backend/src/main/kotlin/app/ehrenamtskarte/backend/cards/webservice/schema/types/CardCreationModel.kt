package app.ehrenamtskarte.backend.cards.webservice.schema.types

data class CardCreationModel(
    val encodedCardInfoBase64: String,
    val generateStaticCodes: Boolean,
)
