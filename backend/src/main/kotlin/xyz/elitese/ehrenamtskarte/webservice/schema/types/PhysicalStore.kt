package xyz.elitese.ehrenamtskarte.webservice.schema.types


data class PhysicalStore(
        val id: Long,
        val address: Address
)

data class Address(
        val street: String,
        val houseNumber: String,
        val postalCode: String,
        val location: String,
        val state: String,
        val coordinates: Coordinates
)

data class Coordinates(
        val latitude: Double,
        val longitude: Double
)
