package app.ehrenamtskarte.backend.graphql.stores

import app.ehrenamtskarte.backend.db.repositories.ContactsRepository
import app.ehrenamtskarte.backend.graphql.newNamedDataLoader
import app.ehrenamtskarte.backend.graphql.stores.types.Contact
import org.jetbrains.exposed.sql.transactions.transaction

val contactLoader = newNamedDataLoader("CONTACT_LOADER") { ids ->
    transaction {
        ContactsRepository.findByIds(ids).map {
            it?.let { Contact(it.id.value, it.email, it.telephone, it.website) }
        }
    }
}
