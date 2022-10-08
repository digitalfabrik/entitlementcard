package app.ehrenamtskarte.backend.stores.importer.steps

import app.ehrenamtskarte.backend.regions.database.RegionEntity
import app.ehrenamtskarte.backend.regions.database.Regions.name
import app.ehrenamtskarte.backend.stores.database.*
import app.ehrenamtskarte.backend.stores.importer.ImportConfig
import app.ehrenamtskarte.backend.stores.importer.PipelineStep
import app.ehrenamtskarte.backend.stores.importer.types.AcceptingStore
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.sql.deleteAll
import org.jetbrains.exposed.sql.transactions.transaction
import org.postgis.Point
import org.slf4j.Logger

/**
 * Stores the given [AcceptingStore] to the database.
 * Longitude, latitude and postal code of [AcceptingStore] must not be null.
 */
class Store(config: ImportConfig, private val logger: Logger) : PipelineStep<List<AcceptingStore>, Unit>(config) {

    override fun execute(input: List<AcceptingStore>) {
        transaction {
            // TODO #538: The right region should be used instead of the dummy region
            val region = RegionEntity.find { name eq config.findProject().id }.first()
            try {
                PhysicalStores.deleteAll()
                AcceptingStores.deleteAll()
                Contacts.deleteAll()
                Addresses.deleteAll()

                input.forEachIndexed { done, acceptingStore ->
                    val address = AddressEntity.new {
                        street = acceptingStore.streetWithHouseNumber
                        postalCode = acceptingStore.postalCode!!
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
                        regionId = region.id
                        storeId = storeEntity.id
                        addressId = address.id
                        coordinates = Point(acceptingStore.longitude!!, acceptingStore.latitude!!)
                    }
                    if (!config.backendConfig.production) {
                        drawSuccessBar(done, input.size)
                    }
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
