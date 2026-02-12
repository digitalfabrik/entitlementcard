package app.ehrenamtskarte.backend.db.entities

import app.ehrenamtskarte.backend.db.columns.gisPoint
import org.jetbrains.exposed.v1.core.dao.id.EntityID
import org.jetbrains.exposed.v1.core.dao.id.IntIdTable
import org.jetbrains.exposed.v1.dao.IntEntity
import org.jetbrains.exposed.v1.dao.IntEntityClass

object PhysicalStores : IntIdTable() {
    val coordinates = gisPoint("coordinates")
    val addressId = reference("addressId", Addresses)
    val storeId = reference("storeId", AcceptingStores)
}

class PhysicalStoreEntity(id: EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<PhysicalStoreEntity>(PhysicalStores)

    var storeId by PhysicalStores.storeId
    var addressId by PhysicalStores.addressId
    var coordinates by PhysicalStores.coordinates
}
