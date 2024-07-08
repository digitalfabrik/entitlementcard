package app.ehrenamtskarte.backend.userdata.database

import app.ehrenamtskarte.backend.projects.database.Projects
import org.jetbrains.exposed.dao.IntEntity
import org.jetbrains.exposed.dao.IntEntityClass
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.dao.id.IntIdTable
import org.jetbrains.exposed.sql.javatime.CurrentTimestamp
import org.jetbrains.exposed.sql.javatime.date
import org.jetbrains.exposed.sql.javatime.timestamp

object UserEntitlements : IntIdTable() {
    val userHash = binary("userHash")
    val startDate = date("startDate")
    val endDate = date("endDate")
    val revoked = bool("revoked")
    val projectId = reference("projectId", Projects)
    val lastUpdated = timestamp("lastUpdated").defaultExpression(CurrentTimestamp())

    init {
        uniqueIndex("unique_userHash_projectId", userHash, projectId)
    }
}

class UserEntitlementsEntity(id: EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<UserEntitlementsEntity>(UserEntitlements)

    var userHash by UserEntitlements.userHash
    var startDate by UserEntitlements.startDate
    var endDate by UserEntitlements.endDate
    var revoked by UserEntitlements.revoked
    var projectId by UserEntitlements.projectId
    var lastUpdated by UserEntitlements.lastUpdated
}
