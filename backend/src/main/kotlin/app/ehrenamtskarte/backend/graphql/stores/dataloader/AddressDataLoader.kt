package app.ehrenamtskarte.backend.graphql.stores.dataloader

import app.ehrenamtskarte.backend.shared.webservice.newNamedDataLoader
import app.ehrenamtskarte.backend.db.repositories.AddressRepository
import app.ehrenamtskarte.backend.graphql.stores.schema.types.Address
import org.jetbrains.exposed.sql.transactions.transaction

val addressLoader = newNamedDataLoader("ADDRESS_LOADER") { ids ->
    transaction {
        AddressRepository.findByIds(ids).map {
            it?.let { Address(it.id.value, it.street, it.postalCode, it.location, it.countryCode) }
        }
    }
}
