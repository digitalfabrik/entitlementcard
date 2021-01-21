package app.ehrenamtskarte.backend.verification.database.repos

import app.ehrenamtskarte.backend.verification.database.CardEntity
import app.ehrenamtskarte.backend.verification.database.Cards
import app.ehrenamtskarte.backend.verification.domain.Card

object CardRepository {
    @ExperimentalUnsignedTypes
    fun findByHashModel(hashModel: String) =
        CardEntity.find { Cards.hashModel eq hashModel }
            .map { Card(it.totpSecret, it.expirationDate, it.hashModel) }
            .singleOrNull()

    @ExperimentalUnsignedTypes
    fun insert(card: Card) = CardEntity.new {
        hashModel = card.hashModel
        totpSecret = card.totpSecret
        expirationDate = card.expirationDate
    }
}
