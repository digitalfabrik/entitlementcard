package xyz.elitese.ehrenamtskarte.importer.dataqa

import xyz.elitese.ehrenamtskarte.importer.types.FreinetAcceptingStore

object FreinetDataFilter {
    fun filterOutInvalidEntries(freinetAcceptingStores : List<FreinetAcceptingStore>) : List<FreinetAcceptingStore> {
        return freinetAcceptingStores.filter { it.postalCode.length <= 5 && it.public == true
                && it.bavarianCategory != null && it.bavarianCategory <= 9 && it.bavarianCategory > 0 }
    }
}