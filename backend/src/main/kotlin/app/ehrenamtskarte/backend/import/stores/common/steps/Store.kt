package app.ehrenamtskarte.backend.import.stores.common.steps

import app.ehrenamtskarte.backend.db.entities.AcceptingStores
import app.ehrenamtskarte.backend.db.entities.ProjectEntity
import app.ehrenamtskarte.backend.db.entities.Projects
import app.ehrenamtskarte.backend.db.entities.RegionEntity
import app.ehrenamtskarte.backend.db.repositories.AcceptingStoresRepository
import app.ehrenamtskarte.backend.db.repositories.RegionsRepository
import app.ehrenamtskarte.backend.import.stores.ImportConfig
import app.ehrenamtskarte.backend.import.stores.PipelineStep
import app.ehrenamtskarte.backend.import.stores.common.types.AcceptingStore
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
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
            val project = ProjectEntity.find { Projects.project eq config.project.id }.single()
            try {
                val acceptingStoreIdsToRemove = AcceptingStores
                    .select(AcceptingStores.id)
                    .where(AcceptingStores.projectId eq project.id)
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
                    val idInDb = AcceptingStoresRepository.getIdIfExists(acceptingStore, project.id, region?.id)

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

private fun getRegionFromAcceptingStore(
    projectId: EntityID<Int>,
    freinetId: Int?,
    districtName: String?,
): RegionEntity? {
    if (freinetId != null) {
        return RegionsRepository.findRegionByFreinetId(freinetId, projectId)
    } else if (!districtName.isNullOrEmpty()) {
        val split = districtName.split(" ", limit = 2)
        return RegionsRepository.findRegionByNameAndPrefix(split[1], split[0], projectId)
    }
    return null
}
