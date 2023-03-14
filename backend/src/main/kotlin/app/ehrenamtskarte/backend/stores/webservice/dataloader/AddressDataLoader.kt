package app.ehrenamtskarte.backend.stores.webservice.dataloader

import app.ehrenamtskarte.backend.common.webservice.newNamedDataLoader
import app.ehrenamtskarte.backend.stores.database.repos.AddressRepository
import app.ehrenamtskarte.backend.stores.webservice.schema.types.Address
import org.jetbrains.exposed.sql.transactions.transaction

val addressLoader = newNamedDataLoader("ADDRESS_LOADER") { ids ->
    transaction {
        AddressRepository.findByIds(ids).map {
            it?.let { Address(it.id.value, it.street, it.postalCode, it.location, it.countryCode) }
        }
    }
}
