package app.ehrenamtskarte.backend.graphql.freinet.types

import app.ehrenamtskarte.backend.graphql.freinet.exceptions.FreinetCardDataInvalidException

data class FreinetCardWithUserId(
    val expirationDate: String?,
    val cardType: String,
    val userId: Int,
) {
    constructor(card: FreinetCard, userId: Int) : this(
        expirationDate = card.expirationDate,
        cardType = card.cardType,
        userId = userId,
    )

    init {
        val validCardTypes = setOf(CARD_TYPE_STANDARD, CARD_TYPE_GOLD)
        require(cardType in validCardTypes) {
            throw FreinetCardDataInvalidException()
        }
        require(userId > 0) {
            throw FreinetCardDataInvalidException()
        }
    }
}
