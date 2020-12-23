package xyz.elitese.ehrenamtskarte.importer.general

import xyz.elitese.ehrenamtskarte.importer.freinet.types.FreinetAcceptingStore
import xyz.elitese.ehrenamtskarte.importer.lbe.types.LbeAcceptingStore

data class GenericImportAcceptingStore(
        val name: String,
        val description: String,
        val street: String,
        val postalCode: String,
        val location: String,
        val countryCode: String,
        val longitude: Double,
        val latitude: Double,
        val email: String,
        val telephone: String,
        val website: String,
        val discount: String,
        val categoryId: Int
) {
    constructor(data: LbeAcceptingStore) : this(
            data.name,
            "",
            data.street,
            data.postalCode,
            data.location,
            "de",
            data.longitude.replace(",", ".").toDouble(),
            data.latitude.replace(",", ".").toDouble(),
            data.email,
            data.telephone,
            data.homepage,
            data.discount,
            if (data.category.toInt() == 99) 9 else data.category.toInt()
    )

    constructor(data: FreinetAcceptingStore) : this(
            data.name,
            "",
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
