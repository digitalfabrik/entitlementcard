package app.ehrenamtskarte.backend.cards.webservice.schema.types

data class CardStatisticsResultModel(
    val region: String,
    val cardsCreated: Int,
    val cardsActivated: Int,
    val cardsActivatedBlue: Int,
    val cardsActivatedGolden: Int,
)
