package app.ehrenamtskarte.backend.db.entities

import org.jetbrains.exposed.v1.core.dao.id.EntityID
import org.jetbrains.exposed.v1.core.dao.id.IntIdTable
import org.jetbrains.exposed.v1.dao.IntEntity
import org.jetbrains.exposed.v1.dao.IntEntityClass

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
