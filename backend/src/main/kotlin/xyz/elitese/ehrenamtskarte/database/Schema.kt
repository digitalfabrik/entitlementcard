package xyz.elitese.ehrenamtskarte.database

import org.jetbrains.exposed.dao.IntEntity
import org.jetbrains.exposed.dao.IntEntityClass
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.dao.id.IntIdTable

object Categories : IntIdTable() {
    val name = varchar("name", 50)
    val iconUrl = varchar("iconUrl", 50)
}

class CategoryEntity(id: EntityID<Int>): IntEntity(id) {
    companion object : IntEntityClass<CategoryEntity>(Categories)
    var name by Categories.name
    var iconUrl by Categories.iconUrl
}

object Contacts : IntIdTable() {
    val email = varchar("email", 50)
    val telephone = varchar("telephone", 50)
    val website = varchar("website", 50)
}

class ContactEntity(id: EntityID<Int>): IntEntity(id) {
    companion object : IntEntityClass<ContactEntity>(Categories)
    var email by Contacts.email
    var telephone by Contacts.telephone
    var website by Contacts.website
}

object AcceptingStores : IntIdTable() {
    val name = varchar("name", 50)
    val contact = reference("contact", Contacts)
    val category = reference("category", Categories)
}

class AcceptingStoreEntity(id: EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<AcceptingStoreEntity>(AcceptingStores)
    var name by AcceptingStores.name
    var contact by AcceptingStores.contact
    var category by AcceptingStores.category
}
