package xyz.elitese.ehrenamtskarte.stores.database.repos

import xyz.elitese.ehrenamtskarte.stores.database.PhysicalStoreEntity
import xyz.elitese.ehrenamtskarte.stores.database.PhysicalStores
import xyz.elitese.ehrenamtskarte.stores.database.sortByKeys

object PhysicalStoresRepository {

    fun findAll() = PhysicalStoreEntity.all()

    fun findByIds(ids: List<Int>) =
        PhysicalStoreEntity.find { PhysicalStores.id inList ids }.sortByKeys({ it.id.value }, ids)

}
