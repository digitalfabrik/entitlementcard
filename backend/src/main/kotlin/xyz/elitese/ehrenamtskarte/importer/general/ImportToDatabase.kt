package xyz.elitese.ehrenamtskarte.importer.general

import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.sql.transactions.transaction
import org.postgis.Point
import xyz.elitese.ehrenamtskarte.database.*

object ImportToDatabase {

    fun import(acceptingStores: List<GenericImportAcceptingStore>) {
        println("Inserting data into db")
        try {
            transaction {
                for (acceptingStore in acceptingStores) {
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
