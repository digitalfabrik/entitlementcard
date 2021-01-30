package app.ehrenamtskarte.backend.verification.database.repos

import app.ehrenamtskarte.backend.verification.database.CardEntity
import app.ehrenamtskarte.backend.verification.database.Cards
import app.ehrenamtskarte.backend.verification.domain.Card

object CardRepository {
    @ExperimentalUnsignedTypes
    fun findByHashModel(hashModel: ByteArray) =
        CardEntity.find { Cards.hashModel eq hashModel }
            .map { Card(it.totpSecret.asList(), it.expirationDate, it.hashModel.asList()) }
            .singleOrNull()

    @ExperimentalUnsignedTypes
    fun insert(card: Card) = CardEntity.new {
        hashModel = card.hashModel.toByteArray()
        totpSecret = card.totpSecret.toByteArray()
        expirationDate = card.expirationDate
    }
}
