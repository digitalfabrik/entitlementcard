package app.ehrenamtskarte.backend.stores.webservice.dataloader

import app.ehrenamtskarte.backend.common.webservice.newNamedDataLoader
import app.ehrenamtskarte.backend.db.repositories.CategoriesRepository
import app.ehrenamtskarte.backend.stores.webservice.schema.types.Category
import org.jetbrains.exposed.sql.transactions.transaction

val categoryLoader = newNamedDataLoader("CATEGORY_LOADER") { ids ->
    transaction {
        CategoriesRepository.findByIds(ids).map {
            it?.let { Category(it.id.value, it.name) }
        }
    }
}
