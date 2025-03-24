package app.ehrenamtskarte.backend.stores.utils

import app.ehrenamtskarte.backend.stores.COUNTRY_CODE
import app.ehrenamtskarte.backend.stores.importer.common.types.AcceptingStore
import app.ehrenamtskarte.backend.stores.webservice.schema.types.CSVAcceptingStore

fun getDiscount(discounts: MutableList<String?>): String {
    discounts.removeIf { it.isNullOrEmpty() }
    return discounts.joinToString("\n\n")
}

fun mapCsvToStore(csvStore: CSVAcceptingStore): AcceptingStore {
    val discount = getDiscount(mutableListOf(csvStore.discountDE, csvStore.discountEN))
    return AcceptingStore(
        csvStore.name!!,
        COUNTRY_CODE,
        csvStore.location!!,
        csvStore.postalCode!!,
        csvStore.street!!,
        csvStore.houseNumber!!,
        "",
        csvStore.longitude!!.toDouble(),
        csvStore.latitude!!.toDouble(),
        csvStore.categoryId!!.toInt(),
        csvStore.email.clean(false),
        csvStore.telephone.clean(false),
        csvStore.homepage.clean(false),
        discount.clean(false),
        null,
        null,
    )
}
