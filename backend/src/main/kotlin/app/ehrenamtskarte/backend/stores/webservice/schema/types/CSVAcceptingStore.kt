package app.ehrenamtskarte.backend.stores.webservice.schema.types

data class CSVAcceptingStore(
    var name: String?,
    var street: String?,
    var houseNumber: String?,
    var postalCode: String?,
    var location: String?,
    var latitude: String?,
    var longitude: String?,
    var telephone: String?,
    var email: String?,
    var homepage: String?,
    var discountDE: String?,
    var discountEN: String?,
    var categoryId: String?,
)
