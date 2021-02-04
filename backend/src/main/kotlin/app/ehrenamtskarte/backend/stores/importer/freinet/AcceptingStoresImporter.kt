package app.ehrenamtskarte.backend.stores.importer.freinet

import app.ehrenamtskarte.backend.stores.importer.freinet.annotations.BooleanField
import app.ehrenamtskarte.backend.stores.importer.freinet.annotations.DoubleField
import app.ehrenamtskarte.backend.stores.importer.freinet.annotations.IntegerField
import app.ehrenamtskarte.backend.stores.importer.freinet.converters.booleanConverter
import app.ehrenamtskarte.backend.stores.importer.freinet.converters.doubleConverter
import app.ehrenamtskarte.backend.stores.importer.freinet.converters.integerConverter
import app.ehrenamtskarte.backend.stores.importer.freinet.dataqa.FreinetDataFilter
import app.ehrenamtskarte.backend.stores.importer.freinet.types.FreinetAcceptingStore
import app.ehrenamtskarte.backend.stores.importer.freinet.types.FreinetData
import app.ehrenamtskarte.backend.stores.importer.general.GenericImportAcceptingStore
import app.ehrenamtskarte.backend.stores.importer.general.ImportToDatabase
import com.beust.klaxon.Klaxon

object AcceptingStoresImporter {

    fun importFromJsonFile(jsonContent: String) {
        val freinetData = parseFreinetJson(jsonContent)!!

        println("Filtering out invalid accepting stores, count before filtering: ${freinetData.data.size}")
        val filteredFreinetAcceptingStores = FreinetDataFilter.filterOutInvalidEntries(freinetData.data)
        println("Count after filtering: ${filteredFreinetAcceptingStores.size}")

        importAcceptingStores(filteredFreinetAcceptingStores)
    }

    private fun parseFreinetJson(freinetJson: String) = Klaxon()
            .fieldConverter(IntegerField::class, integerConverter)
            .fieldConverter(DoubleField::class, doubleConverter)
            .fieldConverter(BooleanField::class, booleanConverter)
            .parse<FreinetData>(freinetJson)

    private fun importAcceptingStores(acceptingStores: List<FreinetAcceptingStore>) {
        val genericStores = acceptingStores.map { GenericImportAcceptingStore(it) }
        ImportToDatabase.import(genericStores)
    }
}
