package app.ehrenamtskarte.backend.stores.webservice

import app.ehrenamtskarte.backend.stores.webservice.schema.types.CSVAcceptingStore
import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import org.jetbrains.exposed.sql.transactions.transaction

@Suppress("unused")
class AcceptingStoresMutationService {

// TODO handling stores in different task
    @GraphQLDescription("Import accepting stores via csv")
    fun importAcceptingStores(stores: List<CSVAcceptingStore>): Boolean {
        transaction {
            // TODO #1571 store the store data in the database
            print(stores)
        }
        return true
    }
}
