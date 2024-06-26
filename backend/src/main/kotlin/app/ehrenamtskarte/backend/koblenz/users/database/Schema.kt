package app.ehrenamtskarte.backend.koblenz.users.database

import org.jetbrains.exposed.dao.IntEntity
import org.jetbrains.exposed.dao.IntEntityClass
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.dao.id.IntIdTable
import org.jetbrains.exposed.sql.javatime.CurrentTimestamp
import org.jetbrains.exposed.sql.javatime.timestamp

object KoblenzUsers : IntIdTable() {
    val userHash = binary("userHash")
    val startDate = timestamp("startDate")
    val endDate = timestamp("endDate")
    val valid = bool("valid")
    val lastUpdated = timestamp("lastUpdated").defaultExpression(CurrentTimestamp())
}

class KoblenzUsersEntity(id: EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<KoblenzUsersEntity>(KoblenzUsers)

    var userHash by KoblenzUsers.userHash
    var startDate by KoblenzUsers.startDate
    var endDate by KoblenzUsers.endDate
    var valid by KoblenzUsers.valid
    var lastUpdated by KoblenzUsers.lastUpdated
}