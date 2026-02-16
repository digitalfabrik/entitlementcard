package app.ehrenamtskarte.backend.graphql.stores

import app.ehrenamtskarte.backend.db.entities.PhysicalStoreEntity
import app.ehrenamtskarte.backend.db.entities.PhysicalStores
import app.ehrenamtskarte.backend.graphql.BaseDataLoader
import app.ehrenamtskarte.backend.graphql.stores.types.PhysicalStore
import org.jetbrains.exposed.v1.core.inList
import org.jetbrains.exposed.v1.jdbc.transactions.transaction
import org.springframework.stereotype.Component

@Component
class PhysicalStoreByStoreIdLoader : BaseDataLoader<Int, PhysicalStore>() {
    override fun loadBatch(keys: List<Int>): Map<Int, PhysicalStore> =
        transaction {
            PhysicalStoreEntity.find { PhysicalStores.storeId inList keys }
                .associateBy({ it.storeId.value }, { PhysicalStore.fromDbEntity(it) })
        }
}
