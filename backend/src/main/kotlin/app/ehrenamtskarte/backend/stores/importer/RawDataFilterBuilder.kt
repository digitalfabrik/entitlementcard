package app.ehrenamtskarte.backend.stores.importer

import app.ehrenamtskarte.backend.stores.importer.types.LbeAcceptingStore

data class FilterBuilder(val store: LbeAcceptingStore, val monitor: ImportMonitor) {

    fun filterLongitudeAndLatitude()
            = if (store.longitude.isNullOrBlank() || store.latitude.isNullOrBlank()) {
        monitor.addMessage("$store was filtered out because longitude or latitude were invalid")
        false
    } else {
        true
    }

    fun filterPostalCode() = if(store.postalCode == null || store.postalCode?.trim()?.length == 5) {
        true
    } else {
        monitor.addMessage("$store was filtered out because postal code is invalid")
        false
    }

    fun filterCategory(): Boolean {
        val category = store.category
        val valid = !category.isNullOrBlank()
                && try {
            category.toInt() in 0..8
        } catch (nfe: NumberFormatException) {
            false
        }

        if (!valid)
            monitor.addMessage("$store was filtered out because category was invlaid")

        return valid
    }

}
