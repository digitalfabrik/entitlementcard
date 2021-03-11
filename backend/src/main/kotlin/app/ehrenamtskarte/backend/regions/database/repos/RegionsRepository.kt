package app.ehrenamtskarte.backend.regions.database.repos

import app.ehrenamtskarte.backend.regions.database.RegionEntity
import app.ehrenamtskarte.backend.regions.database.Regions
import app.ehrenamtskarte.backend.stores.database.sortByKeys

object RegionsRepository {

    fun findAll() = RegionEntity.all()

    fun findByIds(ids: List<Int>) =
        RegionEntity.find { Regions.id inList ids }.sortByKeys({ it.id.value }, ids)

    fun findByRegionIdentifiers(ids: List<String>) =
        RegionEntity.find { Regions.regionIdentifier inList ids }.sortByKeys({ it.regionIdentifier }, ids)

}
