package app.ehrenamtskarte.backend.graphql.stores.types

import app.ehrenamtskarte.backend.db.entities.AcceptingStoreEntity
import app.ehrenamtskarte.backend.graphql.stores.CategoryDataLoader
import app.ehrenamtskarte.backend.graphql.stores.ContactDataLoader
import app.ehrenamtskarte.backend.graphql.stores.PhysicalStoreByStoreIdLoader
import graphql.schema.DataFetchingEnvironment
import org.springframework.graphql.data.method.annotation.SchemaMapping
import org.springframework.stereotype.Controller
import java.util.concurrent.CompletableFuture

data class AcceptingStore(
    val id: Int,
    val name: String?,
    val description: String?,
    val contactId: Int,
    val categoryId: Int,
) {
    companion object {
        fun fromDbEntity(entity: AcceptingStoreEntity) =
            AcceptingStore(
                id = entity.id.value,
                name = entity.name,
                description = entity.description,
                contactId = entity.contactId.value,
                categoryId = entity.categoryId.value,
            )
    }

    // Dummy functions for compatibility with the schema generator.
    // These ensure the fields appear in the generated GraphQL schema.
    @Suppress("unused")
    fun contact(): CompletableFuture<Contact> = CompletableFuture.completedFuture(null)
    @Suppress("unused")
    fun category(): CompletableFuture<Category> = CompletableFuture.completedFuture(null)
    @Suppress("unused")
    fun physicalStore(): CompletableFuture<PhysicalStore?> = CompletableFuture.completedFuture(null)
}

@Controller
class AcceptingStoreResolver {
    @SchemaMapping(typeName = "AcceptingStore", field = "contact")
    fun contact(store: AcceptingStore, dfe: DataFetchingEnvironment): CompletableFuture<Contact> =
        dfe.getDataLoader<Int, Contact>(ContactDataLoader::class.java.name)
            ?.load(store.contactId) ?: CompletableFuture.completedFuture(null)

    @SchemaMapping(typeName = "AcceptingStore", field = "category")
    fun category(store: AcceptingStore, dfe: DataFetchingEnvironment): CompletableFuture<Category> =
        dfe.getDataLoader<Int, Category>(CategoryDataLoader::class.java.name)
            ?.load(store.categoryId) ?: CompletableFuture.completedFuture(null)

    @SchemaMapping(typeName = "AcceptingStore", field = "physicalStore")
    fun physicalStore(store: AcceptingStore, dfe: DataFetchingEnvironment): CompletableFuture<PhysicalStore?> =
        dfe.getDataLoader<Int, PhysicalStore>(PhysicalStoreByStoreIdLoader::class.java.name)
            ?.load(store.id) ?: CompletableFuture.completedFuture(null)
}
