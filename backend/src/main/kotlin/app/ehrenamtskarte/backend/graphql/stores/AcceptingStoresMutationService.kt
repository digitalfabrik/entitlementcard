package app.ehrenamtskarte.backend.graphql.stores

import app.ehrenamtskarte.backend.db.entities.mayUpdateStoresInProject
import app.ehrenamtskarte.backend.db.repositories.AcceptingStoresRepository
import app.ehrenamtskarte.backend.db.repositories.RegionsRepository
import app.ehrenamtskarte.backend.exception.service.ForbiddenException
import app.ehrenamtskarte.backend.graphql.shared.exceptions.InvalidJsonException
import app.ehrenamtskarte.backend.graphql.shared.exceptions.RegionNotUniqueException
import app.ehrenamtskarte.backend.graphql.getAuthContext
import app.ehrenamtskarte.backend.graphql.shared.context
import app.ehrenamtskarte.backend.graphql.stores.schema.types.CSVAcceptingStore
import app.ehrenamtskarte.backend.graphql.stores.schema.types.StoreImportReturnResultModel
import app.ehrenamtskarte.backend.import.COUNTRY_CODE
import app.ehrenamtskarte.backend.import.stores.common.types.AcceptingStore
import app.ehrenamtskarte.backend.import.stores.replaceNa
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
            if (!authContext.admin.mayUpdateStoresInProject(authContext.projectId)) {
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

fun mapCsvToStore(csvStore: CSVAcceptingStore): AcceptingStore {
    val discount = listOf(csvStore.discountDE, csvStore.discountEN)
        .filterNot { it.isNullOrEmpty() }
        .joinToString("\n\n")
    return AcceptingStore(
        csvStore.name.clean()!!,
        COUNTRY_CODE,
        csvStore.location.clean()!!,
        csvStore.postalCode.clean(),
        csvStore.street.clean(),
        csvStore.houseNumber.clean(),
        additionalAddressInformation = "",
        csvStore.longitude,
        csvStore.latitude,
        csvStore.categoryId,
        csvStore.email.clean(false),
        csvStore.telephone.clean(false),
        csvStore.homepage.clean(false),
        discount.clean(false),
        freinetId = null,
        districtName = null,
    )
}

/** Returns null if string can't be trimmed f.e. empty string
 * Removes subsequent whitespaces
 * */
fun String?.clean(removeSubsequentWhitespaces: Boolean = true): String? {
    val trimmed = this?.replaceNa()?.trim()
    if (trimmed.isNullOrEmpty()) {
        return null
    }
    if (removeSubsequentWhitespaces) {
        return trimmed.replace(Regex("""\s{2,}"""), " ")
    }
    return trimmed
}
