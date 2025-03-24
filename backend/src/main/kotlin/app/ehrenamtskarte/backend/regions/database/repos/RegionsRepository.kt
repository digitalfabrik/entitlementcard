package app.ehrenamtskarte.backend.regions.database.repos

import app.ehrenamtskarte.backend.common.database.sortByKeys
import app.ehrenamtskarte.backend.freinet.database.FreinetAgencies
import app.ehrenamtskarte.backend.projects.database.Projects
import app.ehrenamtskarte.backend.regions.database.RegionEntity
import app.ehrenamtskarte.backend.regions.database.Regions
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.sql.SortOrder
import org.jetbrains.exposed.sql.and
import org.jetbrains.exposed.sql.select

object RegionsRepository {

    fun findAllInProject(project: String): List<RegionEntity> {
        val query = (Projects innerJoin Regions)
            .slice(Regions.columns)
            .select { Projects.project eq project }
            .orderBy(Regions.name to SortOrder.ASC)
        return RegionEntity.wrapRows(query).toList()
    }

    fun findByIdsInProject(project: String, ids: List<Int>): List<RegionEntity?> {
        val query = (Projects innerJoin Regions)
            .slice(Regions.columns)
            .select { Projects.project eq project and (Regions.id inList ids) }
        return RegionEntity.wrapRows(query).sortByKeys({ it.id.value }, ids)
    }

    fun findByIdInProject(project: String, id: Int): RegionEntity? {
        return (Projects innerJoin Regions)
            .slice(Regions.columns)
            .select { Projects.project eq project and (Regions.id eq id) }
            .singleOrNull()
            ?.let { RegionEntity.wrapRow(it) }
    }

    fun findByIds(ids: List<Int>) =
        RegionEntity.find { Regions.id inList ids }.sortByKeys({ it.id.value }, ids)

    fun findRegionById(regionId: Int): RegionEntity {
        return RegionEntity[regionId]
    }

    fun updateDataPolicy(region: RegionEntity, dataPrivacyText: String) {
        region.dataPrivacyPolicy = dataPrivacyText
    }

    fun updateRegionSettings(region: RegionEntity, activatedForApplication: Boolean, activatedForConfirmationMail: Boolean) {
        region.activatedForApplication = activatedForApplication
        region.activatedForCardConfirmationMail = activatedForConfirmationMail
    }

    fun findRegionByRegionIdentifier(
        regionIdentifier: String,
        projectId: EntityID<Int>
    ): RegionEntity {
        val regionId = RegionEntity
            .find { Regions.regionIdentifier eq regionIdentifier and (Regions.projectId eq projectId) and Regions.activatedForApplication }
            .single().id
        return RegionEntity[regionId]
    }

    fun findRegionByNameAndPrefix(name: String, prefix: String, projectId: EntityID<Int>): RegionEntity? =
        RegionEntity.find { (Regions.name eq name) and (Regions.prefix eq prefix) and (Regions.projectId eq projectId) }.singleOrNull()

    fun findRegionByFreinetId(freinetId: Int, projectId: EntityID<Int>): RegionEntity? =
        (FreinetAgencies innerJoin Regions)
            .slice(Regions.columns)
            .select { FreinetAgencies.agencyId eq freinetId and (Regions.projectId eq projectId) }
            .singleOrNull()?.let {
                RegionEntity.wrapRow(it)
            }
}
