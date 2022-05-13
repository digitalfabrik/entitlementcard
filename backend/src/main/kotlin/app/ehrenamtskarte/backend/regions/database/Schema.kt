package app.ehrenamtskarte.backend.regions.database

import app.ehrenamtskarte.backend.projects.database.Projects
import org.jetbrains.exposed.dao.IntEntity
import org.jetbrains.exposed.dao.IntEntityClass
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.dao.id.IntIdTable

object Regions : IntIdTable() {
    val projectId = reference("projectId", Projects)
    val regionIdentifier = char("regionIdentifier", 5).uniqueIndex() // 5-stelliger Kreisschlüssel
    val website = varchar("website", 400)
    val name = varchar("name", 100)
    val prefix = varchar("prefix", 30) // Usually "Stadt" or "Landkreis"
}

class RegionEntity(id: EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<RegionEntity>(Regions)

    var projectId by Regions.projectId
    var regionIdentifier by Regions.regionIdentifier
    var website by Regions.website
    var name by Regions.name
    var prefix by Regions.prefix
}
