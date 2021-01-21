package app.ehrenamtskarte.backend.verification.database.repos

import app.ehrenamtskarte.backend.stores.database.ContactEntity
import app.ehrenamtskarte.backend.stores.database.Contacts
import app.ehrenamtskarte.backend.stores.database.sortByKeys
import app.ehrenamtskarte.backend.verification.database.CardEntity
import app.ehrenamtskarte.backend.verification.domain.Card

object CardRepository {
    fun findByIds(ids: List<Int>) =
        ContactEntity.find { Contacts.id inList ids }.sortByKeys({ it.id.value }, ids)

    @ExperimentalUnsignedTypes
    fun insert(card: Card) = CardEntity.new {
        hashModel = card.hashModel
        totpSecret = card.totpSecret
        expirationDate = card.expirationDate
    }
}
