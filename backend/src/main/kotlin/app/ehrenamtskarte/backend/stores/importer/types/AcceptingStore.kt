package app.ehrenamtskarte.backend.stores.importer.types

data class AcceptingStore(
    val name: String,
    val countryCode: String,
    val location: String,
    val postalCode: String?,
    val street: String?,
    val houseNumber: String?,
    val additionalAddressInformation: String?,
    val longitude: Double?,
    val latitude: Double?,
    val categoryId: Int,
    val email: String?,
    val telephone: String?,
    val website: String?,
    val discount: String?,
    val streetWithHouseNumber: String? =
        if (street != null || houseNumber != null) listOfNotNull(street, houseNumber).joinToString(" ")
        else null
)
