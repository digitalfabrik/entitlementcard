package xyz.elitese.ehrenamtskarte.stores.importer.freinet

import com.beust.klaxon.Klaxon
import xyz.elitese.ehrenamtskarte.stores.importer.freinet.annotations.BooleanField
import xyz.elitese.ehrenamtskarte.stores.importer.freinet.annotations.DoubleField
import xyz.elitese.ehrenamtskarte.stores.importer.freinet.annotations.IntegerField
import xyz.elitese.ehrenamtskarte.stores.importer.freinet.converters.booleanConverter
import xyz.elitese.ehrenamtskarte.stores.importer.freinet.converters.doubleConverter
import xyz.elitese.ehrenamtskarte.stores.importer.freinet.converters.integerConverter
import xyz.elitese.ehrenamtskarte.stores.importer.freinet.dataqa.FreinetDataFilter
import xyz.elitese.ehrenamtskarte.stores.importer.freinet.types.FreinetAcceptingStore
import xyz.elitese.ehrenamtskarte.stores.importer.freinet.types.FreinetData
import xyz.elitese.ehrenamtskarte.stores.importer.general.GenericImportAcceptingStore
import xyz.elitese.ehrenamtskarte.stores.importer.general.ImportToDatabase

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
