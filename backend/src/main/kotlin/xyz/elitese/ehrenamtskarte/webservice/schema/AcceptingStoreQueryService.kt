package xyz.elitese.ehrenamtskarte.webservice.schema

import com.expediagroup.graphql.annotations.GraphQLDescription
import graphql.schema.DataFetchingEnvironment
import org.jetbrains.exposed.sql.transactions.transaction
import xyz.elitese.ehrenamtskarte.database.repos.AcceptingStoresRepository
import xyz.elitese.ehrenamtskarte.database.repos.PhysicalStoresRepository
import xyz.elitese.ehrenamtskarte.webservice.dataloader.PHYSICAL_STORE_LOADER_NAME
import xyz.elitese.ehrenamtskarte.webservice.schema.types.AcceptingStore
import xyz.elitese.ehrenamtskarte.webservice.schema.types.Coordinates
import xyz.elitese.ehrenamtskarte.webservice.schema.types.PhysicalStore
import java.util.concurrent.CompletableFuture

@Suppress("unused")
class AcceptingStoreQueryService {

    @GraphQLDescription("Return list of all accepting stores.")
    fun physicalStores(): List<PhysicalStore> = transaction {
        PhysicalStoresRepository.findAll().map {
            PhysicalStore(
                it.id.value,
                it.storeId.value,
                it.addressId.value,
                Coordinates(it.coordinates.x, it.coordinates.y)
            )
        }
    }

    @GraphQLDescription("Returns list of all accepting stores queried by ids.")
    fun physicalStoresById(
        params: IdsParams,
        environment: DataFetchingEnvironment
    ): CompletableFuture<List<PhysicalStore>> =
        environment.getDataLoader<Int, PhysicalStore>(PHYSICAL_STORE_LOADER_NAME).loadMany(params.ids)

    @GraphQLDescription("Search for accepting stores using searchText and categoryIds.")
    fun searchAcceptingStores(params: SearchParams): List<AcceptingStore> = transaction {
        AcceptingStoresRepository.findBySearch(
            params.searchText,
            params.categoryIds,
            params.coordinates,
            params.limit ?: Int.MAX_VALUE,
            params.offset ?: 0
        ).map {
            AcceptingStore(it.id.value, it.name, it.description, it.contactId.value, it.categoryId.value)
        }
    }
}

data class IdsParams(val ids: List<Int>)
data class SearchParams(
    val searchText: String?,
    val categoryIds: List<Int>?,
    val coordinates: Coordinates?,
    val limit: Int?,
    val offset: Long?
)
