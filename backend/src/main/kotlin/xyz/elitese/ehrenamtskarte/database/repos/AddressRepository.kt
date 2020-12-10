package xyz.elitese.ehrenamtskarte.database.repos

import xyz.elitese.ehrenamtskarte.database.AddressEntity
import xyz.elitese.ehrenamtskarte.database.Addresses

object AddressRepository {
    fun findByIds(ids: List<Int>) = AddressEntity.find {
        Addresses.id inList ids
    }
}
