package app.ehrenamtskarte.backend.db.repositories

import app.ehrenamtskarte.backend.common.database.sortByKeys
import app.ehrenamtskarte.backend.db.entities.FreinetAgencies
import app.ehrenamtskarte.backend.db.entities.Projects
import app.ehrenamtskarte.backend.db.entities.RegionEntity
import app.ehrenamtskarte.backend.db.entities.Regions
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.SqlExpressionBuilder.inList
import org.jetbrains.exposed.sql.SortOrder
import org.jetbrains.exposed.sql.and

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

    fun updateDataPolicy(region: RegionEntity, dataPrivacyText: String) {
        region.dataPrivacyPolicy = dataPrivacyText
    }

    fun updateApplicationConfirmationNote(region: RegionEntity, note: String, activated: Boolean) {
        region.applicationConfirmationMailNote = note
        region.applicationConfirmationMailNoteActivated = activated
    }

    fun updateRegionSettings(
        region: RegionEntity,
        activatedForApplication: Boolean,
        activatedForConfirmationMail: Boolean,
    ) {
        region.activatedForApplication = activatedForApplication
        region.activatedForCardConfirmationMail = activatedForConfirmationMail
    }

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
