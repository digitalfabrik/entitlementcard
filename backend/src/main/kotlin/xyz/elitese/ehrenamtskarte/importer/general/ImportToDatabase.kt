package xyz.elitese.ehrenamtskarte.importer.general

import com.beust.klaxon.Klaxon
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.sql.transactions.transaction
import org.postgis.Point
import xyz.elitese.ehrenamtskarte.database.*
import xyz.elitese.ehrenamtskarte.importer.freinet.AcceptingStoresImporter
import xyz.elitese.ehrenamtskarte.importer.freinet.types.Category

object ImportToDatabase {

    fun prepareCategories() {
        val categoriesJson = AcceptingStoresImporter::class.java
                .getResource("/freinet_import/categories.json").readText()
        val categories = Klaxon().parseArray<Category>(categoriesJson)!!

        transaction {
            categories.forEach { CategoryEntity.new(it.id) { name = it.name } }
        }
    }

    fun import(acceptingStores: List<GenericImportAcceptingStore>) {
        println("Inserting data into db")
        try {
            for (acceptingStore in acceptingStores) {
                transaction {
                    val address = AddressEntity.new {
                        street = acceptingStore.street
                        postalCode = acceptingStore.postalCode
                        locaction = acceptingStore.location
                        countryCode = acceptingStore.countryCode
                    }
                    val contact = ContactEntity.new {
                        email = acceptingStore.email
                        telephone = acceptingStore.telephone
                        website = acceptingStore.website
                    }
                    val store = AcceptingStoreEntity.new {
                        name = acceptingStore.name
                        description = acceptingStore.discount
                        contactId = contact.id
                        categoryId = EntityID(acceptingStore.categoryId, Categories)
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
