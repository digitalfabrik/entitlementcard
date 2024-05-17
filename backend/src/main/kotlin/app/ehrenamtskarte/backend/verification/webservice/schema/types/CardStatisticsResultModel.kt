package app.ehrenamtskarte.backend.verification.webservice.schema.types

data class CardStatisticsResultModel(
    val region: String,
    val cardsCreated: Int,
    val cardsActivated: Int
)
