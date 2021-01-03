package xyz.elitese.ehrenamtskarte.database.repos

import xyz.elitese.ehrenamtskarte.database.Categories
import xyz.elitese.ehrenamtskarte.database.CategoryEntity
import xyz.elitese.ehrenamtskarte.database.sortByKeys

object CategoriesRepository {

    fun findByIds(ids: List<Int>) =
        CategoryEntity.find { Categories.id inList ids }.sortByKeys({ it.id.value }, ids)

    fun findAll() = CategoryEntity.all()
}
