package app.ehrenamtskarte.backend.stores.webservice

import app.ehrenamtskarte.backend.auth.getAdministrator
import app.ehrenamtskarte.backend.auth.service.Authorizer
import app.ehrenamtskarte.backend.common.webservice.GraphQLContext
import app.ehrenamtskarte.backend.exception.service.ForbiddenException
import app.ehrenamtskarte.backend.exception.service.ProjectNotFoundException
import app.ehrenamtskarte.backend.exception.webservice.exceptions.InvalidJsonException
import app.ehrenamtskarte.backend.exception.webservice.exceptions.RegionNotUniqueException
import app.ehrenamtskarte.backend.projects.database.ProjectEntity
import app.ehrenamtskarte.backend.projects.database.Projects
import app.ehrenamtskarte.backend.regions.database.repos.RegionsRepository
import app.ehrenamtskarte.backend.stores.database.repos.AcceptingStoresRepository
import app.ehrenamtskarte.backend.stores.utils.mapCsvToStore
import app.ehrenamtskarte.backend.stores.webservice.schema.types.CSVAcceptingStore
import app.ehrenamtskarte.backend.stores.webservice.schema.types.StoreImportReturnResultModel
import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import graphql.schema.DataFetchingEnvironment
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.sql.transactions.transaction

@Suppress("unused")
class AcceptingStoresMutationService {

    @GraphQLDescription("Import accepting stores via csv")
    fun importAcceptingStores(stores: List<CSVAcceptingStore>, project: String, dryRun: Boolean, dfe: DataFetchingEnvironment): StoreImportReturnResultModel {
        val context = dfe.getContext<GraphQLContext>()
        val admin = context.getAdministrator()

        return transaction {
            val projectEntity = ProjectEntity.find { Projects.project eq project }.firstOrNull()
                ?: throw ProjectNotFoundException(project)

            if (!Authorizer.mayUpdateStoresInProject(admin, projectEntity.id.value)) {
                throw ForbiddenException()
            }

            // TODO 2012 provide region ars
            val regionEntity = RegionsRepository.findAllInProject(project).singleOrNull()
                ?: throw RegionNotUniqueException()

            assertNoDuplicateStores(stores)
            handleStoreImport(stores, projectEntity.id, regionEntity.id, dryRun)
        }
    }

    private fun assertNoDuplicateStores(stores: List<CSVAcceptingStore>) {
        val duplicates = stores.groupBy { "${it.name} ${it.street} ${it.houseNumber} ${it.postalCode} ${it.location}" }
            .filterValues { it.size > 1 }
            .keys

        if (duplicates.isNotEmpty()) {
            throw InvalidJsonException("Duplicate store(s) found: ${duplicates.joinToString()}")
        }
    }

    private fun handleStoreImport(stores: List<CSVAcceptingStore>, projectId: EntityID<Int>, regionId: EntityID<Int>, dryRun: Boolean): StoreImportReturnResultModel {
        var numStoresCreated = 0
        var numStoresUntouched = 0

        val acceptingStoreIdsToRemove = AcceptingStoresRepository.getAllIdsInProject(projectId)

        stores.map { store -> mapCsvToStore(store) }.forEach {
            val existingStoreId = AcceptingStoresRepository.getIdIfExists(it, projectId, regionId)
            if (existingStoreId == null) {
                if (!dryRun) {
                    AcceptingStoresRepository.createStore(it, projectId, regionId)
                }
                numStoresCreated++
            } else {
                acceptingStoreIdsToRemove.remove(existingStoreId)
                numStoresUntouched++
            }
        }
        if (!dryRun) {
            AcceptingStoresRepository.deleteStores(acceptingStoreIdsToRemove)
        }

        return StoreImportReturnResultModel(numStoresCreated, acceptingStoreIdsToRemove.size, numStoresUntouched)
    }
}
