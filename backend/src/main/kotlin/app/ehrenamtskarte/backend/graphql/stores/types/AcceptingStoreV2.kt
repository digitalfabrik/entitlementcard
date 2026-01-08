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

data class LocalizedDescription(
    val locale: String,
    val text: String,
)

data class AcceptingStoreV2(
    val id: Int,
    val name: String?,
    val descriptions: List<LocalizedDescription>?,
    val contactId: Int,
    val categoryId: Int,
) {
    companion object {
        fun fromDbEntity(entity: AcceptingStoreEntity): AcceptingStoreV2 {
            val descriptions = entity.descriptions
                .mapNotNull { desc ->
                    desc.description.takeUnless { it.isNullOrBlank() }?.let {
                        LocalizedDescription(
                            locale = desc.language.name,
                            text = desc.description ?: "",
                        )
                    }
                }
                .ifEmpty { null }

            return AcceptingStoreV2(
                id = entity.id.value,
                name = entity.name,
                descriptions = descriptions,
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
class AcceptingStoreResolverV2 {
    @SchemaMapping(typeName = "AcceptingStoreV2", field = "contact")
    fun contact(store: AcceptingStoreV2, dfe: DataFetchingEnvironment): CompletableFuture<Contact> =
        dfe.loadFrom(ContactDataLoader::class, store.contactId).thenApply { it!! }

    @SchemaMapping(typeName = "AcceptingStoreV2", field = "category")
    fun category(store: AcceptingStoreV2, dfe: DataFetchingEnvironment): CompletableFuture<Category> =
        dfe.loadFrom(CategoryDataLoader::class, store.categoryId).thenApply { it!! }

    @SchemaMapping(typeName = "AcceptingStoreV2", field = "physicalStore")
    fun physicalStore(store: AcceptingStoreV2, dfe: DataFetchingEnvironment): CompletableFuture<PhysicalStore?> =
        dfe.loadFrom(PhysicalStoreByStoreIdLoader::class, store.id)
}
