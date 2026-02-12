package app.ehrenamtskarte.backend.db.entities

import org.jetbrains.exposed.v1.core.and
import org.jetbrains.exposed.v1.core.dao.id.EntityID
import org.jetbrains.exposed.v1.core.dao.id.IntIdTable
import org.jetbrains.exposed.v1.core.isNotNull
import org.jetbrains.exposed.v1.core.not
import org.jetbrains.exposed.v1.dao.IntEntity
import org.jetbrains.exposed.v1.dao.IntEntityClass
import org.jetbrains.exposed.v1.javatime.timestamp

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

    val isVerified: Boolean get() = verifiedDate != null || rejectedDate != null
}
