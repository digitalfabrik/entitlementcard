package app.ehrenamtskarte.backend.stores.database.repos

import app.ehrenamtskarte.backend.common.database.sortByKeys
import app.ehrenamtskarte.backend.stores.database.PhysicalStoreEntity
import app.ehrenamtskarte.backend.stores.database.PhysicalStores

object PhysicalStoresRepository {

    fun findAll() = PhysicalStoreEntity.all()

    fun findByIds(ids: List<Int>) =
        PhysicalStoreEntity.find { PhysicalStores.id inList ids }.sortByKeys({ it.id.value }, ids)

}
