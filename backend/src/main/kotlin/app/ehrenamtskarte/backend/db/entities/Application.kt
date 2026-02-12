package app.ehrenamtskarte.backend.db.entities

import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import org.jetbrains.exposed.v1.core.dao.id.EntityID
import org.jetbrains.exposed.v1.core.dao.id.IntIdTable
import org.jetbrains.exposed.v1.dao.IntEntity
import org.jetbrains.exposed.v1.dao.IntEntityClass
import org.jetbrains.exposed.v1.javatime.CurrentTimestamp
import org.jetbrains.exposed.v1.javatime.timestamp
import org.jetbrains.exposed.v1.javatime.timestampWithTimeZone
import java.time.OffsetDateTime

const val NOTE_MAX_CHARS = 1000

object Applications : IntIdTable() {
    val regionId = reference("regionId", Regions)
    val jsonValue = text("jsonValue")
    val createdDate = timestamp("createdDate").defaultExpression(CurrentTimestamp)
    val accessKey = varchar("accessKey", 100).uniqueIndex()
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
        Withdrawn,
    }

    var regionId by Applications.regionId
    var jsonValue by Applications.jsonValue
    var createdDate by Applications.createdDate
    var accessKey by Applications.accessKey
    var note by Applications.note
    private var _status by Applications.status
    var status: Status
        get() = _status
        set(newValue) {
            if (_status == newValue) return
            require(_status.canTransitionTo(newValue)) { "Cannot transition from '$_status' to '$newValue'" }

            if (listOf(Status.Rejected, Status.Approved, Status.Withdrawn).contains(newValue)) {
                statusResolvedDate = OffsetDateTime.now()
            }

            this._status = newValue
        }

    /** Captures the instant that state changes from [Status.Pending] to [Status.Approved] or [Status.Rejected]. */
    var statusResolvedDate by Applications.statusResolvedDate
    var rejectionMessage by Applications.rejectionMessage

    fun parseJsonValue(): JsonNode = jacksonObjectMapper().readTree(jsonValue)
}

/** Check if this state transition makes sense */
private fun ApplicationEntity.Status.canTransitionTo(newValue: ApplicationEntity.Status): Boolean =
    when (this) {
        newValue -> {
            true
        }

        // Always allow setting the same state
        ApplicationEntity.Status.Pending -> {
            when (newValue) {
                ApplicationEntity.Status.Approved -> true
                ApplicationEntity.Status.Rejected -> true
                ApplicationEntity.Status.Withdrawn -> true
                else -> false
            }
        }

        ApplicationEntity.Status.Approved -> {
            when (newValue) {
                ApplicationEntity.Status.ApprovedCardCreated -> true
                else -> false
            }
        }

        else -> {
            false
        }
    }
