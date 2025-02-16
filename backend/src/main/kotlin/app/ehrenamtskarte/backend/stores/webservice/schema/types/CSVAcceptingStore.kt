package app.ehrenamtskarte.backend.stores.webservice.schema.types

import app.ehrenamtskarte.backend.exception.webservice.exceptions.InvalidJsonException

data class CSVAcceptingStore(
    var name: String,
    var street: String,
    var houseNumber: String,
    var postalCode: String,
    var location: String,
    var latitude: Double,
    var longitude: Double,
    var telephone: String?,
    var email: String?,
    var homepage: String?,
    var discountDE: String?,
    var discountEN: String?,
    var categoryId: Int
) {
    init {
        if (name.isBlank()) {
            throw InvalidJsonException("Name cannot be empty")
        }
        if (location.isBlank()) {
            throw InvalidJsonException("Location cannot be empty")
        }
        if (street.isBlank()) {
            throw InvalidJsonException("Street cannot be empty")
        }
        if (houseNumber.isBlank()) {
            throw InvalidJsonException("House number cannot be empty")
        }
        if (postalCode.isBlank()) {
            throw InvalidJsonException("Postal code cannot be empty")
        }
    }
}
