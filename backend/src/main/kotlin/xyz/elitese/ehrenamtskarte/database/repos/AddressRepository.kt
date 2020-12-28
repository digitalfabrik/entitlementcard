package xyz.elitese.ehrenamtskarte.database.repos

import xyz.elitese.ehrenamtskarte.database.AddressEntity

object AddressRepository {
    fun findByIds(ids: List<Int>) = ids.map { AddressEntity.findById(it) }
}
