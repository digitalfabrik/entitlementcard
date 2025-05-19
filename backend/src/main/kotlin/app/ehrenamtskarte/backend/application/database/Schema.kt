package app.ehrenamtskarte.backend.application.database

import app.ehrenamtskarte.backend.regions.database.Regions
import org.jetbrains.exposed.dao.IntEntity
import org.jetbrains.exposed.dao.IntEntityClass
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.dao.id.IntIdTable
import org.jetbrains.exposed.sql.and
import org.jetbrains.exposed.sql.javatime.CurrentTimestamp
import org.jetbrains.exposed.sql.javatime.timestamp
import org.jetbrains.exposed.sql.not

const val NOTE_MAX_CHARS = 1000

object Applications : IntIdTable() {
    val regionId = reference("regionId", Regions)
    val jsonValue = text("jsonValue")
    val createdDate = timestamp("createdDate").defaultExpression(CurrentTimestamp)
    val accessKey = varchar("accessKey", 100).uniqueIndex()
    val withdrawalDate = timestamp("withdrawalDate").nullable()
    val note = varchar("note", NOTE_MAX_CHARS).nullable()
    val cardCreated = bool("cardCreated").default(false)
}

class ApplicationEntity(id: EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<ApplicationEntity>(Applications)

    var regionId by Applications.regionId
    var jsonValue by Applications.jsonValue
    var createdDate by Applications.createdDate
    var accessKey by Applications.accessKey
    var withdrawalDate by Applications.withdrawalDate
    var note by Applications.note
    var cardCreated by Applications.cardCreated
}

enum class ApplicationVerificationExternalSource {
    VEREIN360,
    NONE,
}

object ApplicationVerifications : IntIdTable() {
    val applicationId = reference("applicationId", Applications)
    val contactEmailAddress = varchar("contactEmailAddress", 300)
    val contactName = varchar("contactName", 300)
    val organizationName = varchar("organizationName", 300)
    val verifiedDate = timestamp("verifiedDate").nullable()
    val rejectedDate = timestamp("rejectedDate").nullable()
    val accessKey = varchar("accessKey", 100).uniqueIndex()
    val automaticSource = enumerationByName(
        "automaticSource",
        20,
        ApplicationVerificationExternalSource::class,
    )
        .default(ApplicationVerificationExternalSource.NONE)

    init {
        check("notVerifiedAndRejected") {
            not(verifiedDate.isNotNull() and rejectedDate.isNotNull())
        }
    }
}

class ApplicationVerificationEntity(id: EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<ApplicationVerificationEntity>(ApplicationVerifications)

    var applicationId by ApplicationVerifications.applicationId
    var contactEmailAddress by ApplicationVerifications.contactEmailAddress
    var contactName by ApplicationVerifications.contactName
    var organizationName by ApplicationVerifications.organizationName
    var verifiedDate by ApplicationVerifications.verifiedDate
    var rejectedDate by ApplicationVerifications.rejectedDate
    var accessKey by ApplicationVerifications.accessKey
    var automaticSource by ApplicationVerifications.automaticSource
}
