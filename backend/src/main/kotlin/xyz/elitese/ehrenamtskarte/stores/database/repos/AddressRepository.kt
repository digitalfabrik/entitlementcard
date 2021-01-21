package xyz.elitese.ehrenamtskarte.stores.database.repos

import xyz.elitese.ehrenamtskarte.stores.database.AddressEntity
import xyz.elitese.ehrenamtskarte.stores.database.Addresses
import xyz.elitese.ehrenamtskarte.stores.database.sortByKeys

object AddressRepository {
    fun findByIds(ids: List<Int>) =
        AddressEntity.find { Addresses.id inList ids }.sortByKeys({ it.id.value }, ids)
}
