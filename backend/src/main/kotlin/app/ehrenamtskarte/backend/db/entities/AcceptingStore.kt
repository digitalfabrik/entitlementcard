package app.ehrenamtskarte.backend.db.entities

import org.jetbrains.exposed.v1.core.dao.id.EntityID
import org.jetbrains.exposed.v1.core.dao.id.IntIdTable
import org.jetbrains.exposed.v1.dao.IntEntity
import org.jetbrains.exposed.v1.dao.IntEntityClass
import org.jetbrains.exposed.v1.javatime.CurrentTimestamp
import org.jetbrains.exposed.v1.javatime.timestamp

object AcceptingStores : IntIdTable() {
    val name = varchar("name", 150)
    val contactId = reference("contactId", Contacts)
    val categoryId = reference("categoryId", Categories)
    val projectId = reference("projectId", Projects)
    val regionId = reference("regionId", Regions).nullable()
    val createdAt = timestamp("createdDate").defaultExpression(CurrentTimestamp)
}

class AcceptingStoreEntity(id: EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<AcceptingStoreEntity>(AcceptingStores)

    var name by AcceptingStores.name
    var contactId by AcceptingStores.contactId
    var categoryId by AcceptingStores.categoryId
    var projectId by AcceptingStores.projectId
    var regionId by AcceptingStores.regionId
    var createdDate by AcceptingStores.createdAt
    val descriptions by AcceptingStoreDescriptionEntity referrersOn AcceptingStoreDescriptions.storeId
}
