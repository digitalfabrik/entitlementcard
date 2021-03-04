package app.ehrenamtskarte.backend.stores.importer

import app.ehrenamtskarte.backend.stores.importer.types.LbeAcceptingStore
import org.slf4j.Logger

data class FilterBuilder(val store: LbeAcceptingStore, val logger: Logger) {

    fun filterLongitudeAndLatitude()
            = if (store.longitude.isNullOrBlank() || store.latitude.isNullOrBlank()) {
        logger.info("$store was filtered out because longitude or latitude were invalid")
        false
    } else {
        true
    }

    fun filterPostalCode() = if(store.postalCode == null || store.postalCode?.trim()?.length == 5) {
        true
    } else {
        logger.info("$store was filtered out because postal code is invalid")
        false
    }

    fun filterCategory(): Boolean {
        val category = store.category
        val valid = category?.toIntOrNull() in 0..8 || category?.toIntOrNull() == 99

        if (!valid)
            logger.info("$store was filtered out because category was invalid")

        return valid
    }

}
