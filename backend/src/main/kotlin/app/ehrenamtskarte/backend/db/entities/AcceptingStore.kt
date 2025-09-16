package app.ehrenamtskarte.backend.db.entities

import org.jetbrains.exposed.dao.IntEntity
import org.jetbrains.exposed.dao.IntEntityClass
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.dao.id.IntIdTable
import org.jetbrains.exposed.sql.javatime.CurrentTimestamp
import org.jetbrains.exposed.sql.javatime.timestamp

object AcceptingStores : IntIdTable() {
    val name = varchar("name", 150)
    val description = varchar("description", 2500).nullable()
    val contactId = reference("contactId", Contacts)
    val categoryId = reference("categoryId", Categories)
    val projectId = reference("projectId", Projects)
    val regionId = reference("regionId", Regions).nullable()
    val createdAt = timestamp("createdDate").defaultExpression(CurrentTimestamp)
}

class AcceptingStoreEntity(id: EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<AcceptingStoreEntity>(AcceptingStores)

    var name by AcceptingStores.name
    var description by AcceptingStores.description
    var contactId by AcceptingStores.contactId
    var categoryId by AcceptingStores.categoryId
    var projectId by AcceptingStores.projectId
    var regionId by AcceptingStores.regionId
    var createdDate by AcceptingStores.createdAt
}
