package app.ehrenamtskarte.backend.stores.utils

import app.ehrenamtskarte.backend.graphql.stores.schema.types.CSVAcceptingStore
import app.ehrenamtskarte.backend.stores.COUNTRY_CODE
import app.ehrenamtskarte.backend.stores.importer.common.types.AcceptingStore

fun getDiscount(discounts: List<String?>): String = discounts.filterNot { it.isNullOrEmpty() }.joinToString("\n\n")

fun mapCsvToStore(csvStore: CSVAcceptingStore): AcceptingStore {
    val discount = getDiscount(listOf(csvStore.discountDE, csvStore.discountEN))
    return AcceptingStore(
        csvStore.name.clean()!!,
        COUNTRY_CODE,
        csvStore.location.clean()!!,
        csvStore.postalCode.clean(),
        csvStore.street.clean(),
        csvStore.houseNumber.clean(),
        additionalAddressInformation = "",
        csvStore.longitude,
        csvStore.latitude,
        csvStore.categoryId,
        csvStore.email.clean(false),
        csvStore.telephone.clean(false),
        csvStore.homepage.clean(false),
        discount.clean(false),
        freinetId = null,
        districtName = null,
    )
}
