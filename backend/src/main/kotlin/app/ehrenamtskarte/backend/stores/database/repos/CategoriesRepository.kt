package app.ehrenamtskarte.backend.stores.database.repos

import app.ehrenamtskarte.backend.stores.database.Categories
import app.ehrenamtskarte.backend.stores.database.CategoryEntity
import app.ehrenamtskarte.backend.stores.database.sortByKeys

object CategoriesRepository {

    fun findByIds(ids: List<Int>) =
        CategoryEntity.find { Categories.id inList ids }.sortByKeys({ it.id.value }, ids)

    fun findAll() = CategoryEntity.all()
}
