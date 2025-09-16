package app.ehrenamtskarte.backend.db.entities

import org.jetbrains.exposed.dao.IntEntity
import org.jetbrains.exposed.dao.IntEntityClass
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.dao.id.IntIdTable

object Contacts : IntIdTable() {
    val email = varchar("email", 100).nullable()
    val telephone = varchar("telephone", 100).nullable()
    val website = varchar("website", 200).nullable()
}

class ContactEntity(id: EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<ContactEntity>(Contacts)

    var email by Contacts.email
    var telephone by Contacts.telephone
    var website by Contacts.website
}
