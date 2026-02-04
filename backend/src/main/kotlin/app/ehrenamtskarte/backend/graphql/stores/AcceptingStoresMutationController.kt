package app.ehrenamtskarte.backend.graphql.stores

import app.ehrenamtskarte.backend.db.entities.LanguageCode
import app.ehrenamtskarte.backend.db.entities.mayUpdateStoresInProject
import app.ehrenamtskarte.backend.db.repositories.AcceptingStoresRepository
import app.ehrenamtskarte.backend.db.repositories.RegionsRepository
import app.ehrenamtskarte.backend.graphql.auth.requireAuthContext
import app.ehrenamtskarte.backend.graphql.exceptions.InvalidJsonException
import app.ehrenamtskarte.backend.graphql.exceptions.RegionNotUniqueException
import app.ehrenamtskarte.backend.graphql.exceptions.StoreAlreadyExistsException
import app.ehrenamtskarte.backend.graphql.stores.types.AcceptingStoreInput
import app.ehrenamtskarte.backend.graphql.stores.types.StoreImportReturnResultModel
import app.ehrenamtskarte.backend.import.COUNTRY_CODE
import app.ehrenamtskarte.backend.import.stores.common.types.AcceptingStore
import app.ehrenamtskarte.backend.import.stores.replaceNa
import app.ehrenamtskarte.backend.shared.exceptions.ForbiddenException
import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import graphql.schema.DataFetchingEnvironment
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.sql.transactions.transaction
import org.springframework.graphql.data.method.annotation.Argument
import org.springframework.graphql.data.method.annotation.MutationMapping
import org.springframework.stereotype.Controller

@Controller
class AcceptingStoresMutationService {
    @GraphQLDescription("Import accepting stores via csv")
    @MutationMapping
    fun importAcceptingStores(
        @Argument stores: List<AcceptingStoreInput>,
        @Argument dryRun: Boolean,
        dfe: DataFetchingEnvironment,
    ): StoreImportReturnResultModel {
        val authContext = dfe.requireAuthContext()

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

    @GraphQLDescription("Add accepting store")
    @MutationMapping
    fun addAcceptingStore(
        @Argument store: AcceptingStoreInput,
        dfe: DataFetchingEnvironment,
    ): Boolean {
        val authContext = dfe.requireAuthContext()
        if (!authContext.admin.mayUpdateStoresInProject(authContext.projectId)) {
            throw ForbiddenException()
        }

        transaction {
            // Since we only have ProjectStoreManagers for projects with one exact region, we are fine with getting a single entity.
            // If we want to enable this for projects with multiple regions f.e. EAK, we have to provide a regionId.
            val regionEntity = RegionsRepository.findAllInProject(authContext.project).singleOrNull()
                ?: throw RegionNotUniqueException()
            val acceptingStore = mapCsvToStore(store)
            val existingStoreId = AcceptingStoresRepository.getIdIfExists(
                acceptingStore,
                authContext.admin.projectId,
                regionEntity.id,
            )
            if (existingStoreId != null) {
                throw StoreAlreadyExistsException()
            }
            AcceptingStoresRepository.createStore(acceptingStore, authContext.admin.projectId, regionEntity.id)
        }
        return true
    }

    private fun assertNoDuplicateStores(stores: List<AcceptingStoreInput>) {
        val duplicates = stores.groupBy { "${it.name} ${it.street} ${it.houseNumber} ${it.postalCode} ${it.location}" }
            .filterValues { it.size > 1 }
            .keys

        if (duplicates.isNotEmpty()) {
            throw InvalidJsonException("Duplicate store(s) found: ${duplicates.joinToString()}")
        }
    }

    private fun handleStoreImport(
        stores: List<AcceptingStoreInput>,
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

fun mapCsvToStore(csvStore: AcceptingStoreInput): AcceptingStore {
    val discounts = buildMap {
        csvStore.discountDE?.clean(false)?.let { put(LanguageCode.DE, it) }
        csvStore.discountEN?.clean(false)?.let { put(LanguageCode.EN, it) }
    }
    return AcceptingStore(
        name = csvStore.name.clean()!!,
        countryCode = COUNTRY_CODE,
        location = csvStore.location.clean()!!,
        postalCode = csvStore.postalCode.clean(),
        street = csvStore.street.clean(),
        houseNumber = csvStore.houseNumber.clean(),
        additionalAddressInformation = "",
        longitude = csvStore.longitude,
        latitude = csvStore.latitude,
        categoryId = csvStore.categoryId,
        email = csvStore.email.clean(false),
        telephone = csvStore.telephone.clean(false),
        website = csvStore.homepage.clean(false),
        discounts = discounts,
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
