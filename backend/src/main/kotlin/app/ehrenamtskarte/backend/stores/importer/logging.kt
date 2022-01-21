package app.ehrenamtskarte.backend.stores.importer

import app.ehrenamtskarte.backend.stores.importer.types.AcceptingStore
import org.slf4j.Logger

fun Logger.logChange(storeInfo: String, property: String, oldValue: String?, newValue: String?) {
    if (oldValue == newValue) {
        info("$property of '$storeInfo' could not be improved, keeping '$oldValue'")
    } else {
        info("$property of '$storeInfo' changed from '$oldValue' to '$newValue'")
    }
}

fun Logger.logChange(store: AcceptingStore, property: String, oldValue: String?, newValue: String?) {
    val storeInfo = listOfNotNull(store.name, store.location, store.street, store.houseNumber).joinToString()
    logChange(storeInfo, property, oldValue, newValue)
}
