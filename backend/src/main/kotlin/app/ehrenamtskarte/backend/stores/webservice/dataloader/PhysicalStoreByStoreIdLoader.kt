package app.ehrenamtskarte.backend.stores.webservice.dataloader

import app.ehrenamtskarte.backend.common.database.sortByKeys
import app.ehrenamtskarte.backend.common.webservice.newNamedDataLoader
import app.ehrenamtskarte.backend.stores.database.PhysicalStoreEntity
import app.ehrenamtskarte.backend.stores.database.PhysicalStores
import app.ehrenamtskarte.backend.stores.webservice.schema.types.Coordinates
import app.ehrenamtskarte.backend.stores.webservice.schema.types.PhysicalStore
import org.jetbrains.exposed.sql.transactions.transaction

val physicalStoreByStoreIdLoader = newNamedDataLoader<Int, _>(
    "PHYSICAL_STORE_BY_STORE_ID_LOADER",
) { ids ->
    transaction {
        PhysicalStoreEntity
            .find { PhysicalStores.storeId inList ids }
            .sortByKeys({ it.storeId.value }, ids)
            .map {
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
