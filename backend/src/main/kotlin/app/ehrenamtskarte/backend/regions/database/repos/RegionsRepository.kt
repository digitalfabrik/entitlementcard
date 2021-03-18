package app.ehrenamtskarte.backend.regions.database.repos

import app.ehrenamtskarte.backend.common.database.sortByKeys
import app.ehrenamtskarte.backend.regions.database.RegionEntity
import app.ehrenamtskarte.backend.regions.database.Regions

object RegionsRepository {

    fun findAll() = RegionEntity.all()

    fun findByIds(ids: List<Int>) =
        RegionEntity.find { Regions.id inList ids }.sortByKeys({ it.id.value }, ids)

    fun findById(id: Int) =
        RegionEntity.find { Regions.id eq id }.singleOrNull()

    fun findByRegionIdentifiers(ids: List<String>) =
        RegionEntity.find { Regions.regionIdentifier inList ids }.sortByKeys({ it.regionIdentifier }, ids)

}
