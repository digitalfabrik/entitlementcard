package app.ehrenamtskarte.backend.verification.database.repos

import app.ehrenamtskarte.backend.verification.database.CardEntity
import app.ehrenamtskarte.backend.verification.database.Cards
import java.time.LocalDateTime

object CardRepository {

    fun findByHashModel(hashModel: ByteArray) =
        CardEntity.find { Cards.cardDetailsHash eq hashModel }
            .singleOrNull()

    fun insert(cardDetailsHash: ByteArray, totpSecret: ByteArray, expirationDate: LocalDateTime?) = CardEntity.new {
        this.cardDetailsHash = cardDetailsHash
        this.totpSecret = totpSecret
        this.expirationDate = expirationDate
        this.issueDate = LocalDateTime.now()
        this.revoked = false
    }
}
