package xyz.elitese.ehrenamtskarte.webservice.schema

import com.expediagroup.graphql.annotations.GraphQLDescription
import graphql.schema.DataFetchingEnvironment
import org.jetbrains.exposed.sql.transactions.transaction
import xyz.elitese.ehrenamtskarte.database.repos.AcceptingStoresRepository
import xyz.elitese.ehrenamtskarte.database.repos.PhysicalStoresRepository
import xyz.elitese.ehrenamtskarte.webservice.dataloader.PHYSICAL_STORE_LOADER_NAME
import xyz.elitese.ehrenamtskarte.webservice.schema.types.AcceptingStore
import xyz.elitese.ehrenamtskarte.webservice.schema.types.PhysicalStore

class AcceptingStoreQueryService {

    @GraphQLDescription("Return list of all accepting stores.")
    @Suppress("unused")
    suspend fun physicalStores() = transaction {
        PhysicalStoresRepository.findAll().map {
            PhysicalStore(it.id.value, it.storeId.value, it.addressId.value)
        }
    }

    @Suppress("unused")
    suspend fun physicalStoresById(params: IdsParams, dataFetchingEnvironment: DataFetchingEnvironment) =
            dataFetchingEnvironment.getDataLoader<Int, PhysicalStore>(PHYSICAL_STORE_LOADER_NAME)
                    .loadMany(params.ids).join()

    @Suppress("unused")
    suspend fun searchStores(params: SearchParams) = transaction {
        AcceptingStoresRepository.findBySearch(params.searchText).map {
            AcceptingStore(it.id.value, it.name, it.description, it.contactId.value, it.categoryId.value)
        }
    }
}

data class IdsParams(val ids: List<Int>)
data class SearchParams(val searchText: String) // TODO add category filters
