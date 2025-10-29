package app.ehrenamtskarte.backend.graphql.stores.types

import app.ehrenamtskarte.backend.graphql.exceptions.InvalidJsonException

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
    var categoryId: Int,
) {
    init {
        validate()
    }

    private fun validate() {
        val requiredNotEmpty = listOf(
            "name" to name,
            "location" to location,
            "street" to street,
            "houseNumber" to houseNumber,
            "postalCode" to postalCode,
        )
        requiredNotEmpty.firstOrNull { it.second.isBlank() }?.let { (fieldName, _) ->
            throw InvalidJsonException("Empty string passed for required property: $fieldName")
        }
    }
}
