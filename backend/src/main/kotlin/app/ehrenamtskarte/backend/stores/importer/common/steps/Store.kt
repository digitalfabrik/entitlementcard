package app.ehrenamtskarte.backend.stores.importer.common.steps

import app.ehrenamtskarte.backend.projects.database.ProjectEntity
import app.ehrenamtskarte.backend.projects.database.Projects
import app.ehrenamtskarte.backend.stores.database.AcceptingStoreEntity
import app.ehrenamtskarte.backend.stores.database.AcceptingStores
import app.ehrenamtskarte.backend.stores.database.AddressEntity
import app.ehrenamtskarte.backend.stores.database.Addresses
import app.ehrenamtskarte.backend.stores.database.Categories
import app.ehrenamtskarte.backend.stores.database.ContactEntity
import app.ehrenamtskarte.backend.stores.database.Contacts
import app.ehrenamtskarte.backend.stores.database.PhysicalStoreEntity
import app.ehrenamtskarte.backend.stores.database.PhysicalStores
import app.ehrenamtskarte.backend.stores.database.repos.AcceptingStoresRepository
import app.ehrenamtskarte.backend.stores.importer.ImportConfig
import app.ehrenamtskarte.backend.stores.importer.PipelineStep
import app.ehrenamtskarte.backend.stores.importer.common.types.AcceptingStore
import net.postgis.jdbc.geometry.Point
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.sql.and
import org.jetbrains.exposed.sql.select
import org.jetbrains.exposed.sql.transactions.transaction
import org.slf4j.Logger

/**
 * Stores the given [AcceptingStore] to the database.
 * Longitude, latitude and postal code of [AcceptingStore] must not be null.
 */
class Store(config: ImportConfig, private val logger: Logger) :
    PipelineStep<List<AcceptingStore>, Unit>(config) {

    override fun execute(input: List<AcceptingStore>) {
        transaction {
            val project = ProjectEntity.find { Projects.project eq config.findProject().id }.single()
            try {
                val acceptingStoreIdsToRemove =
                    AcceptingStores.slice(AcceptingStores.id).select { AcceptingStores.projectId eq project.id }
                        .map { it[AcceptingStores.id].value }.toMutableSet()

                var numStoresCreated = 0
                var numStoresUntouched = 0

                for (acceptingStore in input) {
                    // If an exact duplicate is found in the DB, we do not recreate it and instead
                    // remove the id from `storeIdsToRemove`.
                    val idInDb: Int? =
                        AcceptingStores.innerJoin(PhysicalStores).innerJoin(Addresses).innerJoin(Contacts)
                            .slice(AcceptingStores.id).select {
                                (Addresses.street eq acceptingStore.streetWithHouseNumber) and
                                    (Addresses.postalCode eq acceptingStore.postalCode!!) and
                                    (Addresses.location eq acceptingStore.location) and
                                    (Addresses.countryCode eq acceptingStore.countryCode) and
                                    (Contacts.email eq acceptingStore.email) and
                                    (Contacts.telephone eq acceptingStore.telephone) and
                                    (Contacts.website eq acceptingStore.website) and
                                    (AcceptingStores.name eq acceptingStore.name) and
                                    (AcceptingStores.description eq acceptingStore.discount) and
                                    (AcceptingStores.categoryId eq acceptingStore.categoryId) and
                                    (AcceptingStores.regionId.isNull()) and // TODO #538: For now the region is always null
                                    (AcceptingStores.projectId eq project.id) and
                                    (
                                        PhysicalStores.coordinates eq Point(
                                            acceptingStore.longitude!!,
                                            acceptingStore.latitude!!
                                        )
                                        )
                            }.firstOrNull()?.let { it[AcceptingStores.id].value }
                    if (idInDb != null) {
                        acceptingStoreIdsToRemove.remove(idInDb)
                        numStoresUntouched += 1
                        continue
                    }

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

                    numStoresCreated += 1
                }

                AcceptingStoresRepository.deleteStores(acceptingStoreIdsToRemove)
                logger.info(
                    """
                        The following changes were made to the database:
                        Count stores deleted:   ${acceptingStoreIdsToRemove.size}
                        Count stores created:   $numStoresCreated
                        Count stores untouched: $numStoresUntouched
                    """.trimIndent()
                )
            } catch (e: Exception) {
                logger.info("Unknown exception while storing to db", e)
                rollback()
                throw e
            }
        }
    }
}
