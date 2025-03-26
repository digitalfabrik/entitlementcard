package app.ehrenamtskarte.backend.helper

import app.ehrenamtskarte.backend.generated.inputs.CSVAcceptingStoreInput

object CSVAcceptanceStoreBuilder {

    fun build(
        name: String = "Test store",
        street: String = "Teststr.",
        houseNumber: String = "10",
        postalCode: String = "90408",
        location: String = "Nürnberg",
        latitude: Double = 0.0,
        longitude: Double = 0.0,
        telephone: String? = "0911/123456",
        email: String? = "info@test.de",
        homepage: String? = "https://www.test.de",
        discountDE: String? = "100% Ermäßigung",
        discountEN: String? = "100% discount",
        categoryId: Int = 17
    ) = CSVAcceptingStoreInput(
        name = name,
        street = street,
        houseNumber = houseNumber,
        postalCode = postalCode,
        location = location,
        latitude = latitude,
        longitude = longitude,
        telephone = telephone,
        email = email,
        homepage = homepage,
        discountDE = discountDE,
        discountEN = discountEN,
        categoryId = categoryId
    )
}
