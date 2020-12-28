package xyz.elitese.ehrenamtskarte.database.repos

import xyz.elitese.ehrenamtskarte.database.PhysicalStoreEntity
import xyz.elitese.ehrenamtskarte.database.PhysicalStores
import xyz.elitese.ehrenamtskarte.database.associateWithKeys

object PhysicalStoresRepository {

    fun findAll() = PhysicalStoreEntity.all()

    fun findByIds(ids: List<Int>) =
        PhysicalStoreEntity.find { PhysicalStores.id inList ids }.associateWithKeys({ it.id.value }, ids)

}
