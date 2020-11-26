package xyz.elitese.ehrenamtskarte.schema

import com.expediagroup.graphql.annotations.GraphQLDescription
import graphql.schema.DataFetchingEnvironment
import xyz.elitese.ehrenamtskarte.dataloader.ACCEPTING_STORE_LOADER_NAME
import xyz.elitese.ehrenamtskarte.dataloader.allStores
import xyz.elitese.ehrenamtskarte.schema.types.AcceptingStore

class AcceptingStoreQueryService {
    @GraphQLDescription("Return list of all accepting stores.")
    @Suppress("unused")
    suspend fun acceptingStores() = allStores

    @Suppress("unused")
    suspend fun acceptingStoreById(params: Params, dataFetchingEnvironment: DataFetchingEnvironment): List<AcceptingStore?> =
            dataFetchingEnvironment.getDataLoader<Long, AcceptingStore>(ACCEPTING_STORE_LOADER_NAME)
                    .loadMany(params.ids).join()
}

data class Params(val ids: List<Long>)
