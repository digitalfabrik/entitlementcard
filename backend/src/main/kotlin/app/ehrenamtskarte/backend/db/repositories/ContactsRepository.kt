package app.ehrenamtskarte.backend.db.repositories

import app.ehrenamtskarte.backend.db.entities.ContactEntity
import app.ehrenamtskarte.backend.db.entities.Contacts
import app.ehrenamtskarte.backend.shared.database.sortByKeys

object ContactsRepository {
    fun findByIds(ids: List<Int>) = ContactEntity.find { Contacts.id inList ids }.sortByKeys({ it.id.value }, ids)
}
