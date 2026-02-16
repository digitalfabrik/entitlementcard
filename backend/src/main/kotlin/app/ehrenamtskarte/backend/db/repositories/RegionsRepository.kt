package app.ehrenamtskarte.backend.db.repositories

import app.ehrenamtskarte.backend.db.entities.FreinetAgencies
import app.ehrenamtskarte.backend.db.entities.Projects
import app.ehrenamtskarte.backend.db.entities.RegionEntity
import app.ehrenamtskarte.backend.db.entities.Regions
import app.ehrenamtskarte.backend.shared.database.sortByKeys
import org.jetbrains.exposed.v1.core.SortOrder
import org.jetbrains.exposed.v1.core.and
import org.jetbrains.exposed.v1.core.dao.id.EntityID
import org.jetbrains.exposed.v1.core.eq
import org.jetbrains.exposed.v1.core.inList
import org.jetbrains.exposed.v1.jdbc.select

object RegionsRepository {
    fun findAllInProject(project: String): List<RegionEntity> =
        RegionEntity.wrapRows(
            (Projects innerJoin Regions)
                .select(Regions.columns)
                .where(Projects.project eq project)
                .orderBy(Regions.name to SortOrder.ASC),
        ).toList()

    fun findByIdsInProject(project: String, ids: List<Int>): List<RegionEntity?> =
        RegionEntity.wrapRows(
            (Projects innerJoin Regions)
                .select(Regions.columns)
                .where(Projects.project eq project and (Regions.id inList ids)),
        ).sortByKeys({ it.id.value }, ids)

    fun findByIdInProject(project: String, id: Int): RegionEntity? =
        (Projects innerJoin Regions)
            .select(Regions.columns)
            .where(Projects.project eq project and (Regions.id eq id))
            .singleOrNull()
            ?.let { RegionEntity.wrapRow(it) }

    fun findByIds(ids: List<Int>) = RegionEntity.find { Regions.id inList ids }.sortByKeys({ it.id.value }, ids)

    fun findRegionById(regionId: Int): RegionEntity = RegionEntity[regionId]

    fun findRegionByRegionIdentifier(regionIdentifier: String, projectId: EntityID<Int>): RegionEntity? =
        RegionEntity
            .find {
                Regions.regionIdentifier eq regionIdentifier and (Regions.projectId eq projectId) and
                    Regions.activatedForApplication
            }
            .singleOrNull()

    fun findRegionByNameAndPrefix(name: String, prefix: String, projectId: EntityID<Int>): RegionEntity? =
        RegionEntity.find {
            (Regions.name eq name) and (Regions.prefix eq prefix) and (Regions.projectId eq projectId)
        }.singleOrNull()

    fun findRegionByFreinetId(freinetId: Int, projectId: EntityID<Int>): RegionEntity? =
        (FreinetAgencies innerJoin Regions)
            .select(Regions.columns)
            .where(FreinetAgencies.agencyId eq freinetId and (Regions.projectId eq projectId))
            .singleOrNull()
            ?.let { RegionEntity.wrapRow(it) }
}
