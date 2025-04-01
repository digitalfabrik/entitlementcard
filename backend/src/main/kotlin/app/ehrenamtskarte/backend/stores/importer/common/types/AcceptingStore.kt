package app.ehrenamtskarte.backend.stores.importer.common.types

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
    // All stores either come from a district directly or from freinet.
    // In the first case, freinetId is null and districtName is set. In the second case, it is the other way round.
    val freinetId: Int?,
    val districtName: String?,
    val streetWithHouseNumber: String? =
        if (street != null || houseNumber != null) {
            listOfNotNull(street, houseNumber).joinToString(" ")
        } else {
            null
        },
)
