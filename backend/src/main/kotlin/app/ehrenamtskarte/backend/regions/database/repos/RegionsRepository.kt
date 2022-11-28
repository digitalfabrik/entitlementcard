package app.ehrenamtskarte.backend.regions.database.repos

import app.ehrenamtskarte.backend.common.database.sortByKeys
import app.ehrenamtskarte.backend.projects.database.Projects
import app.ehrenamtskarte.backend.regions.database.RegionEntity
import app.ehrenamtskarte.backend.regions.database.Regions
import org.jetbrains.exposed.sql.and
import org.jetbrains.exposed.sql.select

object RegionsRepository {

    fun findAllInProject(project: String): List<RegionEntity> {
        val query = (Projects innerJoin Regions)
            .slice(Regions.columns)
            .select { Projects.project eq project }
        return RegionEntity.wrapRows(query).toList()
    }

    fun findByIdsInProject(project: String, ids: List<Int>): List<RegionEntity?> {
        val query = (Projects innerJoin Regions)
            .slice(Regions.columns)
            .select { Projects.project eq project and (Regions.id inList ids) }
        return RegionEntity.wrapRows(query).sortByKeys({ it.id.value }, ids)
    }

    fun findByIds(ids: List<Int>) =
        RegionEntity.find { Regions.id inList ids }.sortByKeys({ it.id.value }, ids)

    fun findRegionById(regionId: Int): RegionEntity {
        return RegionEntity[regionId]
    }

    fun updateDataPolicy(region: RegionEntity, dataPrivacyText: String) {
        region.dataPrivacyPolicy = dataPrivacyText
    }

}