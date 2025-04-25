package app.ehrenamtskarte.backend.regions.database

import app.ehrenamtskarte.backend.projects.database.Projects
import org.jetbrains.exposed.dao.IntEntity
import org.jetbrains.exposed.dao.IntEntityClass
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.dao.id.IntIdTable

const val PRIVACY_POLICY_MAX_CHARS = 20000
const val APPLICATION_CONFIRMATION_MAIL_NOTE_MAX_CHARS = 1000

object Regions : IntIdTable() {
    val projectId = reference("projectId", Projects)
    val regionIdentifier = char("regionIdentifier", 5) // 5-stelliger Kreisschlüssel
    val website = varchar("website", 400)
    val name = varchar("name", 100)
    val prefix = varchar("prefix", 30) // Usually "Stadt" or "Landkreis"
    val dataPrivacyPolicy = varchar("dataPrivacyPolicy", PRIVACY_POLICY_MAX_CHARS).nullable()
    val activatedForApplication = bool("activatedForApplication").default(true)
    val activatedForCardConfirmationMail = bool("activatedForCardConfirmationMail").default(false)
    val applicationConfirmationMailNoteActivated = bool("applicationConfirmationMailNoteActivated").default(false)
    val applicationConfirmationMailNote = varchar(
        "applicationConfirmationMailNote",
        APPLICATION_CONFIRMATION_MAIL_NOTE_MAX_CHARS,
    ).nullable()

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
    var applicationConfirmationMailNoteActivated by Regions.applicationConfirmationMailNoteActivated
    var applicationConfirmationMailNote by Regions.applicationConfirmationMailNote
}
