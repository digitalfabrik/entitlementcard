package xyz.elitese.ehrenamtskarte.webservice.schema

import com.expediagroup.graphql.annotations.GraphQLDescription
import graphql.schema.DataFetchingEnvironment
import org.jetbrains.exposed.sql.transactions.transaction
import xyz.elitese.ehrenamtskarte.database.repos.AcceptingStoresRepository
import xyz.elitese.ehrenamtskarte.database.repos.PhysicalStoresRepository
import xyz.elitese.ehrenamtskarte.webservice.dataloader.PHYSICAL_STORE_LOADER_NAME
import xyz.elitese.ehrenamtskarte.webservice.schema.types.AcceptingStore
import xyz.elitese.ehrenamtskarte.webservice.schema.types.PhysicalStore

@Suppress("unused")
class AcceptingStoreQueryService {

    @GraphQLDescription("Return list of all accepting stores.")
    suspend fun physicalStores() = transaction {
        PhysicalStoresRepository.findAll().map {
            PhysicalStore(it.id.value, it.storeId.value, it.addressId.value)
        }
    }
    
    suspend fun physicalStoresById(params: IdsParams, dataFetchingEnvironment: DataFetchingEnvironment) =
            dataFetchingEnvironment.getDataLoader<Int, PhysicalStore>(PHYSICAL_STORE_LOADER_NAME)
                    .loadMany(params.ids).join()
    
    suspend fun searchAcceptingStores(params: SearchParams) = transaction {
        AcceptingStoresRepository.findBySearch(params.searchText, params.cagegoryId).map {
            AcceptingStore(it.id.value, it.name, it.description, it.contactId.value, it.categoryId.value)
        }
    }
}

data class IdsParams(val ids: List<Int>)
data class SearchParams(val searchText: String?, val cagegoryId: Int)
