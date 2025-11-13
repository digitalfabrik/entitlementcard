package app.ehrenamtskarte.backend.graphql.stores

import app.ehrenamtskarte.backend.db.repositories.ContactsRepository
import app.ehrenamtskarte.backend.graphql.BaseDataLoader
import app.ehrenamtskarte.backend.graphql.stores.types.Contact
import org.springframework.stereotype.Component

@Component
class ContactDataLoader : BaseDataLoader<Int, Contact>() {
    override fun loadBatch(keys: List<Int>): Map<Int, Contact> =
        ContactsRepository.findByIds(keys)
            .mapNotNull { it?.let { contact -> contact.id.value to Contact.fromDbEntity(contact) } }
            .toMap()
}
