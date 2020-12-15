package xyz.elitese.ehrenamtskarte.importer.freinet

import com.beust.klaxon.Klaxon
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.sql.transactions.transaction
import org.postgis.Point
import xyz.elitese.ehrenamtskarte.database.*
import xyz.elitese.ehrenamtskarte.importer.freinet.annotations.BooleanField
import xyz.elitese.ehrenamtskarte.importer.freinet.annotations.DoubleField
import xyz.elitese.ehrenamtskarte.importer.freinet.annotations.IntegerField
import xyz.elitese.ehrenamtskarte.importer.freinet.converters.booleanConverter
import xyz.elitese.ehrenamtskarte.importer.freinet.converters.doubleConverter
import xyz.elitese.ehrenamtskarte.importer.freinet.converters.integerConverter
import xyz.elitese.ehrenamtskarte.importer.freinet.dataqa.FreinetDataFilter
import xyz.elitese.ehrenamtskarte.importer.freinet.types.Category
import xyz.elitese.ehrenamtskarte.importer.freinet.types.FreinetAcceptingStore
import xyz.elitese.ehrenamtskarte.importer.freinet.types.FreinetData
import xyz.elitese.ehrenamtskarte.importer.general.GenericImportAcceptingStore
import xyz.elitese.ehrenamtskarte.importer.general.ImportToDatabase

object AcceptingStoresImporter {

    fun importFromJsonFile(jsonContent: String) {
        val freinetData = parseFreinetJson(jsonContent)!!

        val categoriesJson = AcceptingStoresImporter::class.java
                .getResource("/freinet_import/categories.json").readText()
        val categories = Klaxon().parseArray<Category>(categoriesJson)!!
        transaction {
            categories.forEach { CategoryEntity.new(it.id) { name = it.name } }
        }
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
