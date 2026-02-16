package app.ehrenamtskarte.backend.db.entities

import org.jetbrains.exposed.v1.core.dao.id.EntityID
import org.jetbrains.exposed.v1.core.dao.id.IntIdTable
import org.jetbrains.exposed.v1.dao.IntEntity
import org.jetbrains.exposed.v1.dao.IntEntityClass

object AcceptingStoreDescriptions : IntIdTable() {
    val storeId = reference("storeId", AcceptingStores)
    val description = varchar("description", 2500).nullable()
    val language = enumerationByName<LanguageCode>("language", 2).default(LanguageCode.DE)

    init {
        uniqueIndex(storeId, language)
    }
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
