package app.ehrenamtskarte.backend.stores.utils

import app.ehrenamtskarte.backend.stores.COUNTRY_CODE
import app.ehrenamtskarte.backend.stores.importer.common.types.AcceptingStore
import app.ehrenamtskarte.backend.stores.webservice.schema.types.CSVAcceptingStore

fun mapCsvToStore(csvStore: CSVAcceptingStore): AcceptingStore {
    return AcceptingStore(
        csvStore.name.clean()!!, COUNTRY_CODE, csvStore.location.clean()!!, csvStore.postalCode.clean()!!, csvStore.street.clean()!!, csvStore.houseNumber.clean()!!, "", csvStore.longitude!!.toDouble(), csvStore.latitude!!.toDouble(), csvStore.categoryId!!.toInt(), csvStore.email, csvStore.telephone, csvStore.homepage, csvStore.discountDE.orEmpty() + "\n\n" + csvStore.discountEN.orEmpty(), null, null
    )
}

fun String?.clean(removeSubsequentWhitespaces: Boolean = true): String? {
    val trimmed = this?.trim()
    if (removeSubsequentWhitespaces) {
        if (trimmed != null) {
            return trimmed.replace(Regex("""\s{2,}"""), " ")
        }
    }
    return trimmed
}
