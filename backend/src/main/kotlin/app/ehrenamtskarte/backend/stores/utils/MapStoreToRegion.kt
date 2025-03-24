package app.ehrenamtskarte.backend.stores.utils

import app.ehrenamtskarte.backend.regions.database.RegionEntity
import app.ehrenamtskarte.backend.regions.database.repos.RegionsRepository
import org.jetbrains.exposed.dao.id.EntityID

fun getRegionFromAcceptingStore(
    projectId: EntityID<Int>,
    freinetId: Int?,
    districtName: String?,
): RegionEntity? {
    if (freinetId != null) {
        return RegionsRepository.findRegionByFreinetId(freinetId, projectId)
    } else if (!districtName.isNullOrEmpty()) {
        val split = districtName.split(" ", limit = 2)
        return RegionsRepository.findRegionByNameAndPrefix(split[1], split[0], projectId)
    }
    return null
}
