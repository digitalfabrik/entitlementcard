package app.ehrenamtskarte.backend.application.database

import app.ehrenamtskarte.backend.regions.database.Regions
import org.jetbrains.exposed.dao.IntEntity
import org.jetbrains.exposed.dao.IntEntityClass
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.dao.id.IntIdTable
import org.jetbrains.exposed.sql.and
import org.jetbrains.exposed.sql.javatime.CurrentDateTime
import org.jetbrains.exposed.sql.javatime.datetime
import org.jetbrains.exposed.sql.not

object Applications : IntIdTable() {
    val regionId = reference("regionId", Regions)
    val jsonValue = text("jsonValue")
    val createdDate = datetime("createdDate").defaultExpression(CurrentDateTime)
}

class ApplicationEntity(id: EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<ApplicationEntity>(
        Applications,
    )

    var regionId by Applications.regionId
    var jsonValue by Applications.jsonValue
    var createdDate by Applications.createdDate
}

object ApplicationVerifications : IntIdTable() {
    val applicationId = reference("applicationId", Applications)
    val contactEmailAddress = varchar("contactEmailAddress", 300)
    val contactName = varchar("contactName", 300)
    val organizationName = varchar("organizationName", 300)
    val verifiedDate = datetime("verifiedDate").nullable()
    val rejectedDate = datetime("rejectedDate").nullable()
    val accessKey = varchar("accessKey", 100).uniqueIndex()

    init {
        check("notVerifiedAndRejected") {
            not(verifiedDate.isNotNull() and verifiedDate.isNotNull())
        }
    }
}

class ApplicationVerificationEntity(id: EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<ApplicationVerificationEntity>(
        ApplicationVerifications,
    )

    var applicationId by ApplicationVerifications.applicationId
    var contactEmailAddress by ApplicationVerifications.contactEmailAddress
    var contactName by ApplicationVerifications.contactName
    var organizationName by ApplicationVerifications.organizationName
    var verifiedDate by ApplicationVerifications.verifiedDate
    var rejectedDate by ApplicationVerifications.rejectedDate
    var accessKey by ApplicationVerifications.accessKey
}
