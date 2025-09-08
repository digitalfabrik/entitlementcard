package app.ehrenamtskarte.backend.db.repositories

import app.ehrenamtskarte.backend.shared.database.sortByKeys
import app.ehrenamtskarte.backend.db.entities.AddressEntity
import app.ehrenamtskarte.backend.db.entities.Addresses

object AddressRepository {
    fun findByIds(ids: List<Int>) = AddressEntity.find { Addresses.id inList ids }.sortByKeys({ it.id.value }, ids)
}
