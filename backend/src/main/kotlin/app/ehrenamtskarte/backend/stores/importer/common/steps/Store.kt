package app.ehrenamtskarte.backend.stores.importer.common.steps

import app.ehrenamtskarte.backend.projects.database.ProjectEntity
import app.ehrenamtskarte.backend.projects.database.Projects
import app.ehrenamtskarte.backend.stores.database.AcceptingStores
import app.ehrenamtskarte.backend.stores.database.repos.AcceptingStoresRepository
import app.ehrenamtskarte.backend.stores.importer.ImportConfig
import app.ehrenamtskarte.backend.stores.importer.PipelineStep
import app.ehrenamtskarte.backend.stores.importer.common.types.AcceptingStore
import app.ehrenamtskarte.backend.stores.utils.getRegionFromAcceptingStore
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
                    AcceptingStores.slice(AcceptingStores.id)
                        .select { AcceptingStores.projectId eq project.id }
                        .map { it[AcceptingStores.id].value }
                        .toMutableSet()

                var numStoresCreated = 0
                var numStoresUntouched = 0

                for (acceptingStore in input) {
                    val region = getRegionFromAcceptingStore(
                        project.id,
                        acceptingStore.freinetId,
                        acceptingStore.districtName,
                    )
                    // If an exact duplicate is found in the DB, we do not recreate it and instead
                    // remove the id from `acceptingStoreIdsToRemove`.
                    val idInDb: Int? =
                        AcceptingStoresRepository.getIdIfExists(acceptingStore, project.id, region?.id)
                    if (idInDb != null) {
                        acceptingStoreIdsToRemove.remove(idInDb)
                        numStoresUntouched += 1
                        continue
                    }

                    AcceptingStoresRepository.createStore(acceptingStore, project.id, region?.id)
                    numStoresCreated += 1
                }

                AcceptingStoresRepository.deleteStores(acceptingStoreIdsToRemove)
                logger.info(
                    """
                        The following changes were made to the database:
                        Count stores deleted:   ${acceptingStoreIdsToRemove.size}
                        Count stores created:   $numStoresCreated
                        Count stores untouched: $numStoresUntouched
                    """.trimIndent(),
                )
            } catch (e: Exception) {
                logger.error("Unknown exception while storing to db", e)
                rollback()
                throw e
            }
        }
    }
}
