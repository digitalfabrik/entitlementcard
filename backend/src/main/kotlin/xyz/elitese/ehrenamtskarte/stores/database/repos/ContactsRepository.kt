package xyz.elitese.ehrenamtskarte.stores.database.repos

import xyz.elitese.ehrenamtskarte.stores.database.ContactEntity
import xyz.elitese.ehrenamtskarte.stores.database.Contacts
import xyz.elitese.ehrenamtskarte.stores.database.sortByKeys

object ContactsRepository {

    fun findByIds(ids: List<Int>) =
        ContactEntity.find { Contacts.id inList ids }.sortByKeys({ it.id.value }, ids)

}
