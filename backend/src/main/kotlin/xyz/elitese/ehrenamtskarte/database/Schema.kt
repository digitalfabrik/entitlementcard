package xyz.elitese.ehrenamtskarte.database

import org.jetbrains.exposed.dao.IntEntity
import org.jetbrains.exposed.dao.IntEntityClass
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.dao.id.IntIdTable

object Categories : IntIdTable() {
    val name = varchar("name", 50)
}

class CategoryEntity(id: EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<CategoryEntity>(Categories)

    var name by Categories.name
}

object Contacts : IntIdTable() {
    val email = varchar("email", 100)
    val telephone = varchar("telephone", 50)
    val website = varchar("website", 150)
}

class ContactEntity(id: EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<ContactEntity>(Contacts)

    var email by Contacts.email
    var telephone by Contacts.telephone
    var website by Contacts.website
}

object AcceptingStores : IntIdTable() {
    val name = varchar("name", 150)
    val description = varchar("description", 2500)
    val contactId = reference("contactId", Contacts)
    val categoryId = reference("categoryId", Categories)
}

class AcceptingStoreEntity(id: EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<AcceptingStoreEntity>(AcceptingStores)

    var name by AcceptingStores.name
    var description by AcceptingStores.description
    var contactId by AcceptingStores.contactId
    var categoryId by AcceptingStores.categoryId
}

object PhysicalStores : IntIdTable() {
    val coordinates = point("coordinates")
    val addressId = reference("addressId", Addresses)
    val storeId = reference("storeId", AcceptingStores)
}

class PhysicalStoreEntity(id: EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<PhysicalStoreEntity>(PhysicalStores)

    var storeId by PhysicalStores.storeId
    var addressId by PhysicalStores.addressId
    var coordinates by PhysicalStores.coordinates
}

object Addresses : IntIdTable() {
    val street = varchar("street", 200)
    val postalCode = varchar("postalCode", 10)
    val location = varchar("location", 200)
    val countryCode = varchar("countryCode", 2)
}

class AddressEntity(id: EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<AddressEntity>(Addresses)

    var street by Addresses.street
    var postalCode by Addresses.postalCode
    var locaction by Addresses.location
    var countryCode by Addresses.countryCode
}
