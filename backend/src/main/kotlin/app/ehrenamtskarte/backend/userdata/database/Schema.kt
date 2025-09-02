package app.ehrenamtskarte.backend.userdata.database

import app.ehrenamtskarte.backend.db.entities.Regions
import org.jetbrains.exposed.dao.IntEntity
import org.jetbrains.exposed.dao.IntEntityClass
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.dao.id.IntIdTable
import org.jetbrains.exposed.sql.javatime.CurrentTimestamp
import org.jetbrains.exposed.sql.javatime.date
import org.jetbrains.exposed.sql.javatime.timestamp

object UserEntitlements : IntIdTable() {
    val userHash = binary("userHash").uniqueIndex()
    val startDate = date("startDate")
    val endDate = date("endDate")
    val revoked = bool("revoked")
    val regionId = reference("regionId", Regions)
    val lastUpdated = timestamp("lastUpdated").defaultExpression(CurrentTimestamp)
}

class UserEntitlementsEntity(id: EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<UserEntitlementsEntity>(UserEntitlements)

    var userHash by UserEntitlements.userHash
    var startDate by UserEntitlements.startDate
    var endDate by UserEntitlements.endDate
    var revoked by UserEntitlements.revoked
    var regionId by UserEntitlements.regionId
    var lastUpdated by UserEntitlements.lastUpdated
}
