package app.ehrenamtskarte.backend.stores.webservice.schema

import app.ehrenamtskarte.backend.stores.database.repos.AcceptingStoresRepository
import app.ehrenamtskarte.backend.stores.database.repos.PhysicalStoresRepository
import app.ehrenamtskarte.backend.stores.webservice.dataloader.PHYSICAL_STORE_LOADER_NAME
import app.ehrenamtskarte.backend.stores.webservice.schema.types.AcceptingStore
import app.ehrenamtskarte.backend.stores.webservice.schema.types.Coordinates
import app.ehrenamtskarte.backend.stores.webservice.schema.types.PhysicalStore
import com.expediagroup.graphql.annotations.GraphQLDescription
import graphql.schema.DataFetchingEnvironment
import org.jetbrains.exposed.sql.transactions.transaction
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
