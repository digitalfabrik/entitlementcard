package app.ehrenamtskarte.backend.regions.database

import app.ehrenamtskarte.backend.projects.database.Projects
import org.jetbrains.exposed.dao.IntEntity
import org.jetbrains.exposed.dao.IntEntityClass
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.dao.id.IntIdTable

const val PRIVACY_POLICY_MAX_CHARS = 20000

object Regions : IntIdTable() {
    val projectId = reference("projectId", Projects)
    val regionIdentifier = char("regionIdentifier", 5) // 5-stelliger Kreisschlüssel
    val website = varchar("website", 400)
    val name = varchar("name", 100)
    val prefix = varchar("prefix", 30) // Usually "Stadt" or "Landkreis"
    val dataPrivacyPolicy = varchar("dataPrivacyPolicy", PRIVACY_POLICY_MAX_CHARS).nullable()
    val activatedForApplication = bool("activatedForApplication").default(true)
    val activatedForCardConfirmationMail = bool("activatedForCardConfirmationMail").default(false)

    init {
        uniqueIndex("unique_projectid_regionidentifier", projectId, regionIdentifier)
    }
}

class RegionEntity(id: EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<RegionEntity>(Regions)

    var projectId by Regions.projectId
    var regionIdentifier by Regions.regionIdentifier
    var website by Regions.website
    var name by Regions.name
    var prefix by Regions.prefix
    var dataPrivacyPolicy by Regions.dataPrivacyPolicy
    var activatedForApplication by Regions.activatedForApplication
    var activatedForCardConfirmationMail by Regions.activatedForCardConfirmationMail
}

object FreinetAgencies : IntIdTable() {
    val regionId = reference("regionId", Regions)
    val agencyId = integer("agencyId").uniqueIndex()
    val apiAccessKey = varchar("apiAccessKey", 10)
}

class FreinetAgenciesEntity(id: EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<FreinetAgenciesEntity>(FreinetAgencies)

    var regionId by FreinetAgencies.regionId
    var agencyId by FreinetAgencies.agencyId
    var apiAccessKey by FreinetAgencies.apiAccessKey
}
