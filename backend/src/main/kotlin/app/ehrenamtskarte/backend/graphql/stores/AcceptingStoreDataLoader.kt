package app.ehrenamtskarte.backend.graphql.stores

import app.ehrenamtskarte.backend.db.repositories.AcceptingStoresRepository
import app.ehrenamtskarte.backend.graphql.BaseDataLoader
import app.ehrenamtskarte.backend.graphql.stores.types.AcceptingStore
import org.springframework.stereotype.Component

@Component
class AcceptingStoreDataLoader : BaseDataLoader<Int, AcceptingStore>() {
    override fun loadBatch(keys: List<Int>): Map<Int, AcceptingStore> =
        AcceptingStoresRepository.findByIds(keys)
            .mapNotNull { it?.let { store -> store.id.value to AcceptingStore.fromDbEntity(store) } }
            .toMap()
}
