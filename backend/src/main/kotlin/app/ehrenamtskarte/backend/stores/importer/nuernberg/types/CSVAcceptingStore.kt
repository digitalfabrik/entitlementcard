package app.ehrenamtskarte.backend.stores.importer.nuernberg.types

data class CSVAcceptingStore(
    var id: String?,
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
    var discount: String?,
    var categoryId: String?,
)
