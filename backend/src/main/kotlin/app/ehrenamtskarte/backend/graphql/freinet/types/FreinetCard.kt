package app.ehrenamtskarte.backend.graphql.freinet.types

import app.ehrenamtskarte.backend.graphql.freinet.exceptions.FreinetCardDataInvalidException

const val CARD_TYPE_STANDARD = "Standard"
const val CARD_TYPE_GOLD = "Goldkarte"

data class FreinetCard(
    val expirationDate: String?,
    val cardType: String,
) {
    init {
        val validCardTypes = setOf(CARD_TYPE_STANDARD, CARD_TYPE_GOLD)
        require(cardType in validCardTypes) {
            throw FreinetCardDataInvalidException()
        }
    }
}
