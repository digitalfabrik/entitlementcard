package app.ehrenamtskarte.backend.verification.database.repos

import app.ehrenamtskarte.backend.verification.database.CardEntity
import app.ehrenamtskarte.backend.verification.database.Cards
import app.ehrenamtskarte.backend.verification.domain.Card

object CardRepository {

    fun findByHashModel(hashModel: ByteArray) =
        CardEntity.find { Cards.cardDetailsHash eq hashModel }
            .map { Card(it.totpSecret.asList(), it.expirationDate, it.cardDetailsHash.asList()) }
            .singleOrNull()

    fun insert(card: Card) = CardEntity.new {
        cardDetailsHash = card.cardDetailsHash.toByteArray()
        totpSecret = card.totpSecret.toByteArray()
        expirationDate = card.expirationDate
    }
}
