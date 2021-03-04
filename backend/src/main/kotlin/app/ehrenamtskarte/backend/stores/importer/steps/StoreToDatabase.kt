package app.ehrenamtskarte.backend.stores.importer.steps

import app.ehrenamtskarte.backend.stores.database.*
import app.ehrenamtskarte.backend.stores.importer.PipelineStep
import app.ehrenamtskarte.backend.stores.importer.types.ImportAcceptingStore
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.sql.deleteAll
import org.jetbrains.exposed.sql.transactions.transaction
import org.postgis.Point
import org.slf4j.Logger

class StoreToDatabase(val logger: Logger, val manualImport: Boolean) : PipelineStep<List<ImportAcceptingStore>, Unit> {

    override fun execute(acceptingStores: List<ImportAcceptingStore>) {
        transaction {
            try {
                PhysicalStores.deleteAll()
                AcceptingStores.deleteAll()
                Contacts.deleteAll()
                Addresses.deleteAll()

                for ((done, acceptingStore) in acceptingStores.withIndex()) {
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
                    val storeEntity = AcceptingStoreEntity.new {
                        name = acceptingStore.name
                        description = acceptingStore.discount
                        contactId = contact.id
                        categoryId = EntityID(acceptingStore.categoryId, Categories)
                    }
                    PhysicalStoreEntity.new {
                        storeId = storeEntity.id
                        addressId = address.id
                        coordinates = Point(acceptingStore.longitude, acceptingStore.latitude)
                    }
                    if (manualImport)
                        drawSuccessBar(done, acceptingStores.size)
                }
            } catch (e: Exception) {
                logger.info("Unknown exception while storing to db", e)
                rollback()
                throw e
            }
        }
    }

    private fun drawSuccessBar(done: Int, of: Int) {
        if (done % 200 == 0) {
            var bar = ""
            repeat(done / 200) { bar += "##" }
            var remaining = ""
            repeat((of - done) / 200) { remaining += "__" }
            println("[$bar$remaining]")
        }
    }

}
