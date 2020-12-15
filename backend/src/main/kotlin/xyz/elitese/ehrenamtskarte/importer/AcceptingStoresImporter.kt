package xyz.elitese.ehrenamtskarte.importer

import com.beust.klaxon.Klaxon
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.sql.transactions.transaction
import org.postgis.Point
import xyz.elitese.ehrenamtskarte.database.*
import xyz.elitese.ehrenamtskarte.importer.annotations.BooleanField
import xyz.elitese.ehrenamtskarte.importer.annotations.DoubleField
import xyz.elitese.ehrenamtskarte.importer.annotations.IntegerField
import xyz.elitese.ehrenamtskarte.importer.converters.booleanConverter
import xyz.elitese.ehrenamtskarte.importer.converters.doubleConverter
import xyz.elitese.ehrenamtskarte.importer.converters.integerConverter
import xyz.elitese.ehrenamtskarte.importer.dataqa.FreinetDataFilter
import xyz.elitese.ehrenamtskarte.importer.types.Category
import xyz.elitese.ehrenamtskarte.importer.types.FreinetAcceptingStore
import xyz.elitese.ehrenamtskarte.importer.types.FreinetData

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
        println("Inserting data into db")
        try {
            transaction {
                for (acceptingStore in acceptingStores) {
                    val address = AddressEntity.new {
                        street = acceptingStore.street
                        postalCode = acceptingStore.postalCode
                        locaction = acceptingStore.location
                        countryCode = "de"
                    }
                    val contact = ContactEntity.new {
                        email = acceptingStore.email
                        telephone = acceptingStore.telephone
                        website = acceptingStore.homepage
                    }
                    val store = AcceptingStoreEntity.new {
                        name = acceptingStore.name
                        description = acceptingStore.discount
                        contactId = contact.id
                        // freinet data category ids are 1-9, but we want 0-8 because that is used in the xml files
                        categoryId = EntityID(acceptingStore.bavarianCategory!! - 1, Categories)
                    }
                    PhysicalStoreEntity.new {
                        storeId = store.id
                        addressId = address.id
                        coordinates = Point(acceptingStore.longitude, acceptingStore.latitude)
                    }
                }
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }
}
