package app.ehrenamtskarte.backend.graphql.stores.dataloader

import app.ehrenamtskarte.backend.graphql.shared.newNamedDataLoader
import app.ehrenamtskarte.backend.db.repositories.CategoriesRepository
import app.ehrenamtskarte.backend.graphql.stores.schema.types.Category
import org.jetbrains.exposed.sql.transactions.transaction

val categoryLoader = newNamedDataLoader("CATEGORY_LOADER") { ids ->
    transaction {
        CategoriesRepository.findByIds(ids).map {
            it?.let { Category(it.id.value, it.name) }
        }
    }
}
