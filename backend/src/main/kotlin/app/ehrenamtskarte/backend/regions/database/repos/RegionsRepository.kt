package app.ehrenamtskarte.backend.regions.database.repos

import app.ehrenamtskarte.backend.common.database.sortByKeys
import app.ehrenamtskarte.backend.projects.database.Projects
import app.ehrenamtskarte.backend.regions.database.RegionEntity
import app.ehrenamtskarte.backend.regions.database.Regions
import org.jetbrains.exposed.sql.and
import org.jetbrains.exposed.sql.select

object RegionsRepository {

    fun findAll(project: String): List<RegionEntity> {
        val query = (Projects innerJoin Regions)
            .slice(Regions.columns)
            .select { Projects.project eq project }
        return RegionEntity.wrapRows(query).toList()
    }

    fun findByIds(project: String, ids: List<Int>): List<RegionEntity> {
        val query = (Projects innerJoin Regions)
            .slice(Regions.columns)
            .select { Projects.project eq project and (Regions.id inList ids) }
        return RegionEntity.wrapRows(query).sortByKeys({ it.id.value }, ids).filterNotNull()
    }

}
