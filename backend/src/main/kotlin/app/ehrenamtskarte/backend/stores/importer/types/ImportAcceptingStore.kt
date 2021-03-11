package app.ehrenamtskarte.backend.stores.importer.types

data class ImportAcceptingStore(
        val name: String?,
        val street: String?,
        val postalCode: String?,
        val location: String?,
        val countryCode: String?,
        val longitude: Double,
        val latitude: Double,
        val email: String?,
        val telephone: String?,
        val website: String?,
        val discount: String?,
        val categoryId: Int
)
