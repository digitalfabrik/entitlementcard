package xyz.elitese.ehrenamtskarte.schema

import com.expediagroup.graphql.annotations.GraphQLDescription
import xyz.elitese.ehrenamtskarte.schema.types.AcceptingStore

class AcceptingStoreQueryService {
    @GraphQLDescription("Return list of all accepting stores.")
    @Suppress("unused")
    suspend fun acceptingStores() = listOf(AcceptingStore(1, "ExampleStore1", 1, 2))
}
