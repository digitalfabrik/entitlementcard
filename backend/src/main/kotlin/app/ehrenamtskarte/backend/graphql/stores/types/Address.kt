package app.ehrenamtskarte.backend.graphql.stores.types

import app.ehrenamtskarte.backend.db.entities.AddressEntity

data class Address(
    val id: Int,
    val street: String?,
    val postalCode: String?,
    val location: String?,
    val state: String?,
) {
    companion object {
        fun fromDbEntity(entity: AddressEntity) =
            Address(
                id = entity.id.value,
                street = entity.street,
                postalCode = entity.postalCode,
                location = entity.location,
                state = entity.countryCode,
            )
    }
}
