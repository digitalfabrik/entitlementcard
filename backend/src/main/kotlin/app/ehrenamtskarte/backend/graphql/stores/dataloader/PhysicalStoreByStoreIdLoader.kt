package app.ehrenamtskarte.backend.graphql.stores.dataloader

import app.ehrenamtskarte.backend.common.database.sortByKeys
import app.ehrenamtskarte.backend.common.webservice.newNamedDataLoader
import app.ehrenamtskarte.backend.db.entities.PhysicalStoreEntity
import app.ehrenamtskarte.backend.db.entities.PhysicalStores
import app.ehrenamtskarte.backend.graphql.stores.schema.types.Coordinates
import app.ehrenamtskarte.backend.graphql.stores.schema.types.PhysicalStore
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
