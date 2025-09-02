package app.ehrenamtskarte.backend.stores.webservice

import app.ehrenamtskarte.backend.auth.getAuthContext
import app.ehrenamtskarte.backend.auth.service.Authorizer
import app.ehrenamtskarte.backend.common.webservice.context
import app.ehrenamtskarte.backend.exception.service.ForbiddenException
import app.ehrenamtskarte.backend.exception.webservice.exceptions.InvalidJsonException
import app.ehrenamtskarte.backend.exception.webservice.exceptions.RegionNotUniqueException
import app.ehrenamtskarte.backend.db.repositories.RegionsRepository
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
    fun importAcceptingStores(
        stores: List<CSVAcceptingStore>,
        dryRun: Boolean,
        dfe: DataFetchingEnvironment,
    ): StoreImportReturnResultModel {
        val authContext = dfe.graphQlContext.context.getAuthContext()

        return transaction {
            if (!Authorizer.mayUpdateStoresInProject(authContext.admin, authContext.projectId)) {
                throw ForbiddenException()
            }

            // TODO 2012 provide region ars
            val regionEntity = RegionsRepository.findAllInProject(authContext.project).singleOrNull()
                ?: throw RegionNotUniqueException()

            assertNoDuplicateStores(stores)
            handleStoreImport(stores, authContext.admin.projectId, regionEntity.id, dryRun)
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

    private fun handleStoreImport(
        stores: List<CSVAcceptingStore>,
        projectId: EntityID<Int>,
        regionId: EntityID<Int>,
        dryRun: Boolean,
    ): StoreImportReturnResultModel {
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
