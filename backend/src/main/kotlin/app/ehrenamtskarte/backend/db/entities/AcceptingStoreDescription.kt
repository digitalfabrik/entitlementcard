package app.ehrenamtskarte.backend.db.entities

import org.jetbrains.exposed.dao.IntEntity
import org.jetbrains.exposed.dao.IntEntityClass
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.dao.id.IntIdTable

object AcceptingStoreDescriptions : IntIdTable() {
    val storeId = reference("storeId", AcceptingStores)
    val language = varchar("language", 2)
    val description = varchar("description", 2500).nullable()
}

class AcceptingStoreDescriptionEntity(id: EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<AcceptingStoreDescriptionEntity>(AcceptingStoreDescriptions)

    var storeId by AcceptingStoreDescriptions.storeId
    val language by AcceptingStoreDescriptions.language
    var description by AcceptingStoreDescriptions.description
}
