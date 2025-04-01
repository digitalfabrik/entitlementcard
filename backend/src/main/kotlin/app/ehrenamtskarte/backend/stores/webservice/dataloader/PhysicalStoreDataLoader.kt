package app.ehrenamtskarte.backend.stores.webservice.dataloader

import app.ehrenamtskarte.backend.common.webservice.newNamedDataLoader
import app.ehrenamtskarte.backend.stores.database.repos.PhysicalStoresRepository
import app.ehrenamtskarte.backend.stores.webservice.schema.types.Coordinates
import app.ehrenamtskarte.backend.stores.webservice.schema.types.PhysicalStore
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
