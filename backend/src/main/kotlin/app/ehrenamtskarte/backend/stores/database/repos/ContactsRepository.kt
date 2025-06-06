package app.ehrenamtskarte.backend.stores.database.repos

import app.ehrenamtskarte.backend.common.database.sortByKeys
import app.ehrenamtskarte.backend.stores.database.ContactEntity
import app.ehrenamtskarte.backend.stores.database.Contacts

object ContactsRepository {
    fun findByIds(ids: List<Int>) = ContactEntity.find { Contacts.id inList ids }.sortByKeys({ it.id.value }, ids)
}
