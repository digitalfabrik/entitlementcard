package app.ehrenamtskarte.backend.import.stores.bayern.types

import app.ehrenamtskarte.backend.import.stores.common.types.AcceptingStore

data class FilteredStore(
    val name: String?,
    val street: String?,
    val houseNumber: String?,
    val postalCode: String?,
    val location: String?,
    val reason: String,
) {
    constructor(
        lbeStore: LbeAcceptingStore,
        reason: String,
    ) : this(lbeStore.name, lbeStore.street, lbeStore.houseNumber, lbeStore.postalCode, lbeStore.location, reason)
    constructor(
        store: AcceptingStore,
        reason: String,
    ) : this(store.name, store.street, store.houseNumber, store.postalCode, store.location, reason)
}
