package app.ehrenamtskarte.backend.stores.database.repos

import app.ehrenamtskarte.backend.stores.database.AddressEntity
import app.ehrenamtskarte.backend.stores.database.Addresses
import app.ehrenamtskarte.backend.stores.database.sortByKeys

object AddressRepository {
    fun findByIds(ids: List<Int>) =
        AddressEntity.find { Addresses.id inList ids }.sortByKeys({ it.id.value }, ids)
}
