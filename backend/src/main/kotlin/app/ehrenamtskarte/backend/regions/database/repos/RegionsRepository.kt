package app.ehrenamtskarte.backend.regions.database.repos

import app.ehrenamtskarte.backend.common.database.sortByKeys
import app.ehrenamtskarte.backend.projects.database.Projects
import app.ehrenamtskarte.backend.regions.database.RegionEntity
import app.ehrenamtskarte.backend.regions.database.Regions
import org.apache.commons.csv.CSVRecord
import org.jetbrains.exposed.dao.id.EntityID
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

    fun findRegionByPostalCode(postalCode: String, projectId: EntityID<Int>, postalCodes: Map<String, String>): RegionEntity {
        val regionIdentifier = postalCodes[postalCode] ?: throw Exception("Region couldn't be found")
        val regionId = RegionEntity.find { Regions.regionIdentifier eq regionIdentifier and (Regions.projectId eq projectId) }.single().id
        return RegionEntity[regionId]
    }

    fun getPostalCodes(records: Iterable<CSVRecord>): MutableMap<String, String> {
        val postalCodes: MutableMap<String, String> = mutableMapOf()
        records.forEachIndexed { index, record ->
            val headline = index == 0
            if (record[1].isNotEmpty() && !headline) {
                postalCodes[record[1]] = '0' + record[0].substring(0, 4)
            }
        }
        return postalCodes
    }
}
