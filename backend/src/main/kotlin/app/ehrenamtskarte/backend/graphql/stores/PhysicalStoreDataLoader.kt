package app.ehrenamtskarte.backend.graphql.stores

import app.ehrenamtskarte.backend.db.repositories.PhysicalStoresRepository
import app.ehrenamtskarte.backend.graphql.BaseDataLoader
import app.ehrenamtskarte.backend.graphql.stores.types.PhysicalStore
import org.springframework.stereotype.Component

@Component
class PhysicalStoreDataLoader : BaseDataLoader<Int, PhysicalStore>() {
    override fun loadBatch(keys: List<Int>): Map<Int, PhysicalStore> =
        PhysicalStoresRepository.findByIds(keys)
            .mapNotNull { it?.let { store -> store.id.value to PhysicalStore.fromDbEntity(store) } }
            .toMap()
}
