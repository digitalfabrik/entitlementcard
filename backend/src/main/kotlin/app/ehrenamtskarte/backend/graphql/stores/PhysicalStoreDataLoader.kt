package app.ehrenamtskarte.backend.graphql.stores

import app.ehrenamtskarte.backend.db.repositories.PhysicalStoresRepository
import app.ehrenamtskarte.backend.graphql.newNamedDataLoader
import app.ehrenamtskarte.backend.graphql.stores.types.Coordinates
import app.ehrenamtskarte.backend.graphql.stores.types.PhysicalStore
import org.jetbrains.exposed.sql.transactions.transaction

val physicalStoreLoader = newNamedDataLoader("PHYSICAL_STORE_LOADER") { ids ->
    transaction {
        PhysicalStoresRepository.findByIds(ids).map {
            it?.let {
                PhysicalStore(
                    it.id.value,
                    it.storeId.value,
                    it.addressId.value,
                    Coordinates(it.coordinates.x, it.coordinates.y),
                )
            }
        }
    }
}
