package app.ehrenamtskarte.backend.stores.importer.pipelines

import app.ehrenamtskarte.backend.projects.database.ProjectEntity
import app.ehrenamtskarte.backend.projects.database.Projects
import app.ehrenamtskarte.backend.stores.database.AcceptingStoreEntity
import app.ehrenamtskarte.backend.stores.database.AddressEntity
import app.ehrenamtskarte.backend.stores.database.Categories
import app.ehrenamtskarte.backend.stores.database.ContactEntity
import app.ehrenamtskarte.backend.stores.database.PhysicalStoreEntity
import app.ehrenamtskarte.backend.stores.importer.ImportConfig
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.sql.transactions.transaction
import org.postgis.Point
import org.slf4j.Logger

object SozialpassNuernberg : Pipeline {
    override fun import(config: ImportConfig, logger: Logger) {
        logger.info("Not implemented yet!")
        transaction {
            val project = ProjectEntity.find { Projects.project eq config.findProject().id }.single()
            try {
                project.deleteAssociatedStores()

                val address = AddressEntity.new {
                    street = "Test"
                    postalCode = "Test"
                    location = "Test"
                    countryCode = "DE"
                }
                val contact = ContactEntity.new {
                    email = "test@test.de"
                    telephone = "123"
                    website = "example.net"
                }
                val storeEntity = AcceptingStoreEntity.new {
                    name = "Sozialamt"
                    description = "Ein Amt"
                    contactId = contact.id
                    categoryId = EntityID(1, Categories) // Multimedia
                    regionId = null // TODO #538: For now the region is always null
                    projectId = project.id
                }
                PhysicalStoreEntity.new {
                    storeId = storeEntity.id
                    addressId = address.id
                    coordinates = Point(11.061859, 49.460983)
                }
            } catch (e: Exception) {
                logger.info("Unknown exception while storing to db", e)
                rollback()
                throw e
            }
        }
    }
}
