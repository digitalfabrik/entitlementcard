package xyz.elitese.ehrenamtskarte.webservice.schema

import com.expediagroup.graphql.annotations.GraphQLDescription
import graphql.schema.DataFetchingEnvironment
import org.jetbrains.exposed.sql.transactions.transaction
import xyz.elitese.ehrenamtskarte.database.repos.PhysicalStoresRepository
import xyz.elitese.ehrenamtskarte.webservice.dataloader.PHYSICAL_STORE_LOADER_NAME
import xyz.elitese.ehrenamtskarte.webservice.schema.types.PhysicalStore

class AcceptingStoreQueryService {

    @GraphQLDescription("Return list of all accepting stores.")
    @Suppress("unused")
    suspend fun acceptingStores() = transaction {
        PhysicalStoresRepository.findAll().map {
            PhysicalStore(it.id.value, it.storeId.value, it.addressId.value)
        }
    }

    @Suppress("unused")
    suspend fun acceptingStoreById(params: Params, dataFetchingEnvironment: DataFetchingEnvironment) =
            dataFetchingEnvironment.getDataLoader<Int, PhysicalStore>(PHYSICAL_STORE_LOADER_NAME)
                    .loadMany(params.ids).join()
}

data class Params(val ids: List<Int>)
