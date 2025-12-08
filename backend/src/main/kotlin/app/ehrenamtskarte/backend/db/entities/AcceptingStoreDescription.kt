package app.ehrenamtskarte.backend.db.entities

import org.jetbrains.exposed.dao.IntEntity
import org.jetbrains.exposed.dao.IntEntityClass
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.dao.id.IntIdTable

object AcceptingStoreDescriptions : IntIdTable() {
    val storeId = reference("storeId", AcceptingStores)
    val description = varchar("description", 2500).nullable()
    val language = enumerationByName<LanguageCode>("language", 2).default(LanguageCode.DE)
}

class AcceptingStoreDescriptionEntity(id: EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<AcceptingStoreDescriptionEntity>(AcceptingStoreDescriptions)

    var storeId by AcceptingStoreDescriptions.storeId
    var description by AcceptingStoreDescriptions.description
    var language by AcceptingStoreDescriptions.language
}

enum class LanguageCode {
    DE,
    EN,
}
