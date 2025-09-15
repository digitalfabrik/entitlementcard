package app.ehrenamtskarte.backend.graphql.stores

import app.ehrenamtskarte.backend.db.repositories.AcceptingStoresRepository
import app.ehrenamtskarte.backend.graphql.newNamedDataLoader
import app.ehrenamtskarte.backend.graphql.stores.types.AcceptingStore
import org.jetbrains.exposed.sql.transactions.transaction

val acceptingStoreLoader = newNamedDataLoader("ACCEPTING_STORE_LOADER") { ids ->
    transaction {
        AcceptingStoresRepository.findByIds(ids).map {
            it?.let {
                AcceptingStore(
                    it.id.value,
                    it.name,
                    it.description,
                    it.contactId.value,
                    it.categoryId.value,
                )
            }
        }
    }
}
