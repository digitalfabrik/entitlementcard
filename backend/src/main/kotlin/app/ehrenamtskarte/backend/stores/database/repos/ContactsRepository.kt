package app.ehrenamtskarte.backend.stores.database.repos

import app.ehrenamtskarte.backend.stores.database.ContactEntity
import app.ehrenamtskarte.backend.stores.database.Contacts
import app.ehrenamtskarte.backend.stores.database.sortByKeys

object ContactsRepository {

    fun findByIds(ids: List<Int>) =
        ContactEntity.find { Contacts.id inList ids }.sortByKeys({ it.id.value }, ids)

}
