package app.ehrenamtskarte.backend.regions.database.repos

import app.ehrenamtskarte.backend.common.database.sortByKeys
import app.ehrenamtskarte.backend.projects.database.Projects
import app.ehrenamtskarte.backend.regions.database.RegionEntity
import app.ehrenamtskarte.backend.regions.database.Regions
import org.apache.commons.csv.CSVFormat
import org.apache.commons.csv.CSVRecord
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.and
import org.jetbrains.exposed.sql.select
import java.io.FileReader

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

    fun findRegionByPostalCode(postalCode: String): RegionEntity {
        print(postalCode)
        val csvInput = FileReader("src/main/resources/import/plz_ort_bayern.csv")
        val records: Iterable<CSVRecord> = CSVFormat.RFC4180.parse(csvInput)
        val postalCodes: MutableMap<String, String> = getPostalCodes(records)
        val regionIdentifier = postalCodes[postalCode]!!
        val regionId = RegionEntity.find { Regions.regionIdentifier eq regionIdentifier }.single().id
        return RegionEntity[regionId]
    }

    private fun getPostalCodes(records: Iterable<CSVRecord>): MutableMap<String, String> {
        val postalCodes: MutableMap<String, String> = mutableMapOf()
        records.forEachIndexed { index, record ->
            val headline = index == 0
            // at least a name is required
            if (record[1].isNotEmpty() && !headline) {
                postalCodes[record[1]] = '0' + record[0].substring(0, 4)
            }
        }
        return postalCodes
    }
}
