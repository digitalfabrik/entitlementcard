package app.ehrenamtskarte.backend.import.stores

import app.ehrenamtskarte.backend.import.stores.bayern.types.FilteredStore
import app.ehrenamtskarte.backend.import.stores.common.types.AcceptingStore
import org.slf4j.Logger

fun Logger.logChange(storeInfo: String, property: String, oldValue: String?, newValue: String?) {
    if (oldValue == newValue) {
        info("$property of '$storeInfo' could not be improved, keeping '$oldValue'")
    } else {
        info("$property of '$storeInfo' changed to '$newValue' from '$oldValue'")
    }
}

fun Logger.logChange(store: AcceptingStore, property: String, oldValue: String?, newValue: String?) {
    logChange(storeInfo(store), property, oldValue, newValue)
}

fun Logger.logRemoveDuplicates(store: AcceptingStore, count: Int, filteredStores: MutableList<FilteredStore>) {
    val reason = "Removed duplicates ($count) of '${storeInfo(store)}'"
    info(reason)
    filteredStores.add(FilteredStore(store, reason))
}

private fun storeInfo(store: AcceptingStore): String =
    listOfNotNull(store.name, store.location, store.street, store.houseNumber).joinToString()
