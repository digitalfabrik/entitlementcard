package app.ehrenamtskarte.backend.stores.importer.general

import app.ehrenamtskarte.backend.stores.importer.freinet.types.FreinetAcceptingStore
import app.ehrenamtskarte.backend.stores.importer.lbe.types.LbeAcceptingStore

data class GenericImportAcceptingStore(
        val name: String?,
        val description: String?,
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
) {
    constructor(data: LbeAcceptingStore) : this(
            data.name,
            "",
            data.street,
            data.postalCode,
            data.location,
            "de",
            data.longitude!!.replace(",", ".").toDouble(),
            data.latitude!!.replace(",", ".").toDouble(),
            data.email,
            data.telephone,
            data.homepage,
            data.discount,
            data.category!!.toInt()
    )

    constructor(data: FreinetAcceptingStore) : this(
            data.name,
            null,
            data.street,
            data.postalCode,
            data.location,
            "de",
            data.longitude,
            data.latitude,
            data.email,
            data.telephone,
            data.homepage,
            data.discount,
            data.bavarianCategory!! - 1
    )
}
