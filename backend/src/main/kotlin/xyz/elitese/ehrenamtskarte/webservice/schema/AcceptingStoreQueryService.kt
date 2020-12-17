package xyz.elitese.ehrenamtskarte.webservice.schema

import com.expediagroup.graphql.annotations.GraphQLDescription
import graphql.schema.DataFetchingEnvironment
import org.jetbrains.exposed.sql.transactions.transaction
import xyz.elitese.ehrenamtskarte.database.repos.PhysicalStoresRepository
import xyz.elitese.ehrenamtskarte.webservice.dataloader.PHYSICAL_STORE_LOADER_NAME
import xyz.elitese.ehrenamtskarte.webservice.schema.types.PhysicalStore
import java.util.concurrent.CompletableFuture

class AcceptingStoreQueryService {

    @GraphQLDescription("Return list of all accepting stores.")
    fun physicalStores() = transaction {
        PhysicalStoresRepository.findAll().map {
            PhysicalStore(it.id.value, it.storeId.value, it.addressId.value)
        }
    }

    @GraphQLDescription("Returns list of all accepting stores queried by ids.")
    fun physicalStoresById(
        params: Params,
        environment: DataFetchingEnvironment
    ): CompletableFuture<List<PhysicalStore>> =
        environment.getDataLoader<Int, PhysicalStore>(PHYSICAL_STORE_LOADER_NAME).loadMany(params.ids)
}

data class Params(val ids: List<Int>)
