package xyz.elitese.ehrenamtskarte.stores.database.repos

import xyz.elitese.ehrenamtskarte.stores.database.Categories
import xyz.elitese.ehrenamtskarte.stores.database.CategoryEntity
import xyz.elitese.ehrenamtskarte.stores.database.sortByKeys

object CategoriesRepository {

    fun findByIds(ids: List<Int>) =
        CategoryEntity.find { Categories.id inList ids }.sortByKeys({ it.id.value }, ids)

    fun findAll() = CategoryEntity.all()
}
