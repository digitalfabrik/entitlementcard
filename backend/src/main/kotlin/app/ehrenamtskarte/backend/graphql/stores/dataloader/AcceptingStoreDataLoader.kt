package app.ehrenamtskarte.backend.graphql.stores.dataloader

import app.ehrenamtskarte.backend.common.webservice.newNamedDataLoader
import app.ehrenamtskarte.backend.db.repositories.AcceptingStoresRepository
import app.ehrenamtskarte.backend.graphql.stores.schema.types.AcceptingStore
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
