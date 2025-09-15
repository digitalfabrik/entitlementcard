package app.ehrenamtskarte.backend.db.entities

import org.jetbrains.exposed.dao.IntEntity
import org.jetbrains.exposed.dao.IntEntityClass
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.dao.id.IntIdTable

object Addresses : IntIdTable() {
    val street = varchar("street", 200).nullable()
    val postalCode = varchar("postalCode", 10)
    val location = varchar("location", 200)
    val countryCode = varchar("countryCode", 2)
}

class AddressEntity(id: EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<AddressEntity>(Addresses)

    var street by Addresses.street
    var postalCode by Addresses.postalCode
    var location by Addresses.location
    var countryCode by Addresses.countryCode
}
