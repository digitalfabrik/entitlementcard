package xyz.elitese.ehrenamtskarte.webservice.schema

import com.expediagroup.graphql.annotations.GraphQLDescription
import graphql.schema.DataFetchingEnvironment
import org.jetbrains.exposed.sql.transactions.transaction
import xyz.elitese.ehrenamtskarte.database.repos.AcceptingStoresRepository
import xyz.elitese.ehrenamtskarte.webservice.dataloader.ACCEPTING_STORE_LOADER_NAME
import xyz.elitese.ehrenamtskarte.webservice.schema.types.AcceptingStore

class AcceptingStoreQueryService {

    @GraphQLDescription("Return list of all accepting stores.")
    @Suppress("unused")
    suspend fun acceptingStores() = transaction {
        AcceptingStoresRepository.findAll().map {
            AcceptingStore(it.id.value, it.name, it.contactId.value, it.categoryId.value)
        }
    }

    @Suppress("unused")
    suspend fun acceptingStoreById(params: Params, dataFetchingEnvironment: DataFetchingEnvironment): List<AcceptingStore?> =
            dataFetchingEnvironment.getDataLoader<Long, AcceptingStore>(ACCEPTING_STORE_LOADER_NAME)
                    .loadMany(params.ids).join()
}

data class Params(val ids: List<Long>)
