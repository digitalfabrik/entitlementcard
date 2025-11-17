package app.ehrenamtskarte.backend.graphql.stores

import app.ehrenamtskarte.backend.db.repositories.CategoriesRepository
import app.ehrenamtskarte.backend.graphql.BaseDataLoader
import app.ehrenamtskarte.backend.graphql.stores.types.Category
import org.springframework.stereotype.Component

@Component
class CategoryDataLoader : BaseDataLoader<Int, Category>() {
    override fun loadBatch(keys: List<Int>): Map<Int, Category> =
        CategoriesRepository.findByIds(keys)
            .mapNotNull { it?.let { category -> category.id.value to Category.fromDbEntity(category) } }
            .toMap()
}
