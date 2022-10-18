package app.ehrenamtskarte.backend.stores.importer.steps

import app.ehrenamtskarte.backend.projects.database.ProjectEntity
import app.ehrenamtskarte.backend.projects.database.Projects
import app.ehrenamtskarte.backend.stores.database.AcceptingStoreEntity
import app.ehrenamtskarte.backend.stores.database.AddressEntity
import app.ehrenamtskarte.backend.stores.database.Categories
import app.ehrenamtskarte.backend.stores.database.ContactEntity
import app.ehrenamtskarte.backend.stores.database.PhysicalStoreEntity
import app.ehrenamtskarte.backend.stores.importer.ImportConfig
import app.ehrenamtskarte.backend.stores.importer.PipelineStep
import app.ehrenamtskarte.backend.stores.importer.types.AcceptingStore
import org.jetbrains.exposed.dao.id.EntityID
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
            val project = ProjectEntity.find { Projects.project eq config.findProject().id }.single()
            try {
                project.deleteAssociatedStores()

                input.forEachIndexed { done, acceptingStore ->
                    val address = AddressEntity.new {
                        street = acceptingStore.streetWithHouseNumber
                        postalCode = acceptingStore.postalCode!!
                        location = acceptingStore.location
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
                        regionId = null // TODO #538: For now the region is always null
                        projectId = project.id
                    }
                    PhysicalStoreEntity.new {
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
