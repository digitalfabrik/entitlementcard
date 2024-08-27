package app.ehrenamtskarte.backend.stores.webservice

import app.ehrenamtskarte.backend.exception.service.ProjectNotFoundException
import app.ehrenamtskarte.backend.projects.database.ProjectEntity
import app.ehrenamtskarte.backend.projects.database.Projects
import app.ehrenamtskarte.backend.stores.database.AcceptingStores
import app.ehrenamtskarte.backend.stores.database.repos.AcceptingStoresRepository
import app.ehrenamtskarte.backend.stores.utils.mapCsvToStore
import app.ehrenamtskarte.backend.stores.webservice.schema.types.CSVAcceptingStore
import app.ehrenamtskarte.backend.stores.webservice.schema.types.StoreImportResultModel
import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import org.jetbrains.exposed.sql.select
import org.jetbrains.exposed.sql.transactions.transaction

@Suppress("unused")
class AcceptingStoresMutationService {
    @GraphQLDescription("Import accepting stores via csv")
    fun importAcceptingStores(stores: List<CSVAcceptingStore>, project: String): StoreImportResultModel {
        return transaction t@{
            val projectEntity =
                ProjectEntity.find { Projects.project eq project }.firstOrNull() ?: throw ProjectNotFoundException(
                    project
                )
            try {
                var numStoresCreated = 0
                var numStoresUntouched = 0
                val acceptingStoreIdsToRemove =
                    AcceptingStores.slice(AcceptingStores.id).select { AcceptingStores.projectId eq projectEntity.id }
                        .map { it[AcceptingStores.id].value }.toMutableSet()

                for (acceptingStore in stores) {
                    // If an exact duplicate is found in the DB, we do not recreate it and instead
                    // remove the id from `acceptingStoreIdsToRemove`.
                    val existingStoreId: Int? =
                        AcceptingStoresRepository.determineRemovableAcceptingStoreId(mapCsvToStore(acceptingStore), projectEntity)
                    if (existingStoreId != null) {
                        acceptingStoreIdsToRemove.remove(existingStoreId)
                        numStoresUntouched += 1
                        continue
                    }
                    AcceptingStoresRepository.createStore(mapCsvToStore(acceptingStore), projectEntity)
                    numStoresCreated += 1
                }
                AcceptingStoresRepository.deleteStores(acceptingStoreIdsToRemove)
                return@t StoreImportResultModel(numStoresCreated, acceptingStoreIdsToRemove.size, numStoresUntouched)
            } catch (e: Exception) {
                // TODO add error handling
                rollback()
                throw e
            }
        }
    }
}
