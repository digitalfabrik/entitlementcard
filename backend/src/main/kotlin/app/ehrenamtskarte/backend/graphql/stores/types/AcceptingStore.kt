package app.ehrenamtskarte.backend.graphql.stores.types

import app.ehrenamtskarte.backend.db.entities.AcceptingStoreEntity
import app.ehrenamtskarte.backend.graphql.loadFrom
import app.ehrenamtskarte.backend.graphql.stores.CategoryDataLoader
import app.ehrenamtskarte.backend.graphql.stores.ContactDataLoader
import app.ehrenamtskarte.backend.graphql.stores.PhysicalStoreByStoreIdLoader
import graphql.schema.DataFetchingEnvironment
import org.springframework.graphql.data.method.annotation.SchemaMapping
import org.springframework.stereotype.Controller
import java.util.concurrent.CompletableFuture

@Deprecated("Use AcceptingStoreV2 for localized descriptions. Should be able to safely remove in January 2028.")
data class AcceptingStore(
    val id: Int,
    val name: String?,
    val description: String?,
    val contactId: Int,
    val categoryId: Int,
) {
    companion object {
        fun fromDbEntity(entity: AcceptingStoreEntity): AcceptingStore {
            // merge descriptions from all languages into a single string for backward compatibility
            val description = entity.descriptions
                .map { it.description }
                .filterNot { it.isNullOrBlank() }
                .joinToString(separator = "\n\n")
                .ifEmpty { null }

            return AcceptingStore(
                id = entity.id.value,
                name = entity.name,
                description = description,
                contactId = entity.contactId.value,
                categoryId = entity.categoryId.value,
            )
        }
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
        dfe.loadFrom(ContactDataLoader::class, store.contactId).thenApply { it!! }

    @SchemaMapping(typeName = "AcceptingStore", field = "category")
    fun category(store: AcceptingStore, dfe: DataFetchingEnvironment): CompletableFuture<Category> =
        dfe.loadFrom(CategoryDataLoader::class, store.categoryId).thenApply { it!! }

    @SchemaMapping(typeName = "AcceptingStore", field = "physicalStore")
    fun physicalStore(store: AcceptingStore, dfe: DataFetchingEnvironment): CompletableFuture<PhysicalStore?> =
        dfe.loadFrom(PhysicalStoreByStoreIdLoader::class, store.id)
}
