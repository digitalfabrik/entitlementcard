package app.ehrenamtskarte.backend.stores.webservice.schema.types

import app.ehrenamtskarte.backend.stores.webservice.dataloader.CATEGORY_LOADER_NAME
import app.ehrenamtskarte.backend.stores.webservice.dataloader.CONTACT_LOADER_NAME
import app.ehrenamtskarte.backend.stores.webservice.dataloader.PHYSICAL_STORE_BY_STORE_ID_LOADER_NAME
import graphql.schema.DataFetchingEnvironment
import java.util.concurrent.CompletableFuture


data class AcceptingStore(
    val id: Int,
    val name: String?,
    val description: String?,
    val contactId: Int,
    val categoryId: Int
) {

    fun contact(dataFetchingEnvironment: DataFetchingEnvironment): CompletableFuture<Contact> =
        dataFetchingEnvironment.getDataLoader<Int, Contact>(CONTACT_LOADER_NAME).load(contactId)

    fun category(dataFetchingEnvironment: DataFetchingEnvironment): CompletableFuture<Category> =
        dataFetchingEnvironment.getDataLoader<Int, Category>(CATEGORY_LOADER_NAME).load(categoryId)

    fun physicalStore(dataFetchingEnvironment: DataFetchingEnvironment): CompletableFuture<PhysicalStore?> =
        dataFetchingEnvironment.getDataLoader<Int, PhysicalStore?>(PHYSICAL_STORE_BY_STORE_ID_LOADER_NAME).load(id)
}
