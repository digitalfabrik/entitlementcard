package app.ehrenamtskarte.backend.application.database

import app.ehrenamtskarte.backend.regions.database.Regions
import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import org.jetbrains.exposed.dao.IntEntity
import org.jetbrains.exposed.dao.IntEntityClass
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.dao.id.IntIdTable
import org.jetbrains.exposed.sql.and
import org.jetbrains.exposed.sql.javatime.CurrentTimestamp
import org.jetbrains.exposed.sql.javatime.timestamp
import org.jetbrains.exposed.sql.javatime.timestampWithTimeZone
import org.jetbrains.exposed.sql.not
import java.time.OffsetDateTime

const val NOTE_MAX_CHARS = 1000

object Applications : IntIdTable() {
    val regionId = reference("regionId", Regions)
    val jsonValue = text("jsonValue")
    val createdDate = timestamp("createdDate").defaultExpression(CurrentTimestamp)
    val accessKey = varchar("accessKey", 100).uniqueIndex()
    val withdrawalDate = timestamp("withdrawalDate").nullable()
    val note = varchar("note", NOTE_MAX_CHARS).nullable()
    val status = enumerationByName<ApplicationEntity.Status>("status", length = 32)
        .default(ApplicationEntity.Status.Pending)
    val statusResolvedDate = timestampWithTimeZone("statusResolvedDate").nullable()
    val rejectionMessage = text("rejectionMessage").nullable()
}

class ApplicationEntity(id: EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<ApplicationEntity>(Applications)

    enum class Status {
        Pending,
        Rejected,
        Approved,
        ApprovedCardCreated,
    }

    var regionId by Applications.regionId
    var jsonValue by Applications.jsonValue
    var createdDate by Applications.createdDate
    var accessKey by Applications.accessKey
    var withdrawalDate by Applications.withdrawalDate
    var note by Applications.note
    private var _status by Applications.status
    var status: Status
        get() = _status
        set(newValue) {
            require(_status.canTransitionTo(newValue)) { "Cannot transition from '$_status' to '$newValue'" }

            if (newValue == Status.Rejected || newValue == Status.Approved) {
                statusResolvedDate = OffsetDateTime.now()
            }

            this._status = newValue
        }

    /** Captures the instant that state changes from [Status.Pending] to [Status.Approved] or [Status.Rejected]. */
    var statusResolvedDate by Applications.statusResolvedDate
    var rejectionMessage by Applications.rejectionMessage

    /** Try to change the status to the given value. Returns true if successful, false otherwise. */
    fun tryChangeStatus(status: Status): Boolean =
        try {
            this.status = status
            true
        } catch (_: IllegalArgumentException) {
            false
        }

    fun parseJsonValue(): JsonNode = jacksonObjectMapper().readTree(jsonValue)
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

    val isVerified: Boolean get() = verifiedDate != null || rejectedDate != null
}

/** Check if this state transition makes sense */
private fun ApplicationEntity.Status.canTransitionTo(newValue: ApplicationEntity.Status): Boolean =
    when (this) {
        newValue -> true // Always allow setting the same state
        ApplicationEntity.Status.Pending -> {
            when (newValue) {
                ApplicationEntity.Status.Approved -> true
                ApplicationEntity.Status.Rejected -> true
                else -> false
            }
        }
        ApplicationEntity.Status.Approved -> {
            when (newValue) {
                ApplicationEntity.Status.ApprovedCardCreated -> true
                else -> false
            }
        }
        else -> false
    }
