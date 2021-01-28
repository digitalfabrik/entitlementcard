package app.ehrenamtskarte.backend.stores.importer.freinet.dataqa

import app.ehrenamtskarte.backend.stores.importer.freinet.types.FreinetAcceptingStore
import com.beust.klaxon.Klaxon
import java.io.File

object FreinetDataFilter {
    private val filters = listOf(
            Filter({ it.postalCode.length <= 5 }, "Postal code too long"),
            Filter({ it.public == true }, "Is not flagged as public"),
            Filter({ it.bavarianCategory != null && it.bavarianCategory <= 9 && it.bavarianCategory > 0 }, "Category id not in range of (1-9)"),
            Filter({ it.longitude != 0.0 && it.latitude != 0.0 }, "One of long or lat was exactly zero")
    )

    fun filterOutInvalidEntries(freinetAcceptingStores : List<FreinetAcceptingStore>) : List<FreinetAcceptingStore> {
        val rejectedStores = ArrayList<Pair<FreinetAcceptingStore, String>>()
        val validStores = ArrayList<FreinetAcceptingStore>()

        for (store in freinetAcceptingStores) {
            var isValid = true
            for (filter in filters) {
                if (!filter.filterFunc(store)) {
                    rejectedStores.add(Pair(store, filter.cause))
                    isValid = false
                    break
                }
            }
            if (isValid) {
                validStores.add(store)
            }
        }
        File("rejectedStores.json").writeText((Klaxon().toJsonString(rejectedStores)))

        return validStores
    }

    private data class Filter(val filterFunc: (FreinetAcceptingStore) -> Boolean, val cause: String)
}
