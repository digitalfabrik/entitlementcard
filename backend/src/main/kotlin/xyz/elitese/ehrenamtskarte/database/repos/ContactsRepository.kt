package xyz.elitese.ehrenamtskarte.database.repos

import xyz.elitese.ehrenamtskarte.database.ContactEntity
import xyz.elitese.ehrenamtskarte.database.Contacts

object ContactsRepository {

    fun findByIds(ids: List<Int>) = ContactEntity.find {
        Contacts.id inList ids
    }


}
