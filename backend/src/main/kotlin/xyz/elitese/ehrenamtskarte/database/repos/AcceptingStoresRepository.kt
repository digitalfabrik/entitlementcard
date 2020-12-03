package xyz.elitese.ehrenamtskarte.database.repos

import xyz.elitese.ehrenamtskarte.database.AcceptingStoreEntity
import xyz.elitese.ehrenamtskarte.database.AcceptingStores

object AcceptingStoresRepository {

    fun findAll() = AcceptingStoreEntity.all()

    fun findByIds(ids: List<Int>) = AcceptingStoreEntity.find {
        AcceptingStores.id inList ids
    }

}
