package app.ehrenamtskarte.backend.stores.webservice.schema.types

import app.ehrenamtskarte.backend.common.webservice.fromEnvironment
import app.ehrenamtskarte.backend.stores.webservice.dataloader.categoryLoader
import app.ehrenamtskarte.backend.stores.webservice.dataloader.contactLoader
import app.ehrenamtskarte.backend.stores.webservice.dataloader.physicalStoreByStoreIdLoader
import graphql.schema.DataFetchingEnvironment
import java.util.concurrent.CompletableFuture

@Suppress("unused")
data class AcceptingStore(
    val id: Int,
    val name: String?,
    val description: String?,
    val contactId: Int,
    val categoryId: Int,
) {
    fun contact(environment: DataFetchingEnvironment): CompletableFuture<Contact> =
        contactLoader.fromEnvironment(environment).load(contactId).thenApply { it!! }

    fun category(environment: DataFetchingEnvironment): CompletableFuture<Category> =
        categoryLoader.fromEnvironment(environment).load(categoryId).thenApply { it!! }

    fun physicalStore(environment: DataFetchingEnvironment): CompletableFuture<PhysicalStore?> =
        physicalStoreByStoreIdLoader.fromEnvironment(environment).load(id)
}
