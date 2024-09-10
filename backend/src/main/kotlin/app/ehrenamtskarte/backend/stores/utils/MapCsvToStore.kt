package app.ehrenamtskarte.backend.stores.utils

import app.ehrenamtskarte.backend.stores.COUNTRY_CODE
import app.ehrenamtskarte.backend.stores.importer.common.types.AcceptingStore
import app.ehrenamtskarte.backend.stores.webservice.schema.types.CSVAcceptingStore

fun getDiscount(discountDE: String?, discountEN: String?): String? {
    if (discountDE.isNullOrEmpty() && discountEN.isNullOrEmpty()) {
        return null
    }
    return discountDE.orEmpty() + "\n\n" + discountEN.orEmpty()
}
fun mapCsvToStore(csvStore: CSVAcceptingStore): AcceptingStore {
    val discount = getDiscount(csvStore.discountDE, csvStore.discountEN)
    return AcceptingStore(
        csvStore.name!!, COUNTRY_CODE, csvStore.location!!, csvStore.postalCode!!, csvStore.street!!, csvStore.houseNumber!!, "", csvStore.longitude!!.toDouble(), csvStore.latitude!!.toDouble(), csvStore.categoryId!!.toInt(), csvStore.email.clean(false), csvStore.telephone.clean(false),
        csvStore.homepage.clean(false), discount, null, null
    )
}
