package app.ehrenamtskarte.backend.db.entities

import app.ehrenamtskarte.backend.graphql.exceptions.InvalidApplicationConfirmationNoteSizeException
import app.ehrenamtskarte.backend.graphql.exceptions.InvalidContactInformationSizeException
import org.jetbrains.exposed.v1.core.dao.id.EntityID
import org.jetbrains.exposed.v1.core.dao.id.IntIdTable
import org.jetbrains.exposed.v1.dao.IntEntity
import org.jetbrains.exposed.v1.dao.IntEntityClass

const val PRIVACY_POLICY_MAX_CHARS = 20000
const val APPLICATION_CONFIRMATION_MAIL_NOTE_MAX_CHARS = 1000
const val CONTACT_INFORMATION_MAX_CHARS = 500

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
    val contactInformationActivated = bool("contactInformationActivated").default(false)
    val contactInformation = text("contactInformation").nullable()

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
    private var _applicationConfirmationMailNote by Regions.applicationConfirmationMailNote
    var applicationConfirmationMailNote: String?
        get() = _applicationConfirmationMailNote
        set(newValue) {
            if (newValue != null && newValue.length > APPLICATION_CONFIRMATION_MAIL_NOTE_MAX_CHARS) {
                throw InvalidApplicationConfirmationNoteSizeException(APPLICATION_CONFIRMATION_MAIL_NOTE_MAX_CHARS)
            }
            _applicationConfirmationMailNote = newValue
        }
    var contactInformationActivated by Regions.contactInformationActivated
    private var _contactInformation by Regions.contactInformation
    var contactInformation: String?
        get() = _contactInformation
        set(newValue) {
            if (newValue != null && newValue.length > CONTACT_INFORMATION_MAX_CHARS) {
                throw InvalidContactInformationSizeException(CONTACT_INFORMATION_MAX_CHARS)
            }
            _contactInformation = newValue
        }

    val activeApplicationConfirmationMailNote: String?
        get() = applicationConfirmationMailNote.takeIf { applicationConfirmationMailNoteActivated }
    val activeContactInformation: String?
        get() = contactInformation.takeIf { contactInformationActivated }
}
