package xyz.elitese.ehrenamtskarte.database.repos

import xyz.elitese.ehrenamtskarte.database.Categories
import xyz.elitese.ehrenamtskarte.database.CategoryEntity
import xyz.elitese.ehrenamtskarte.database.associateWithKeys

object CategoriesRepository {

    fun findByIds(ids: List<Int>) =
        CategoryEntity.find { Categories.id inList ids }.associateWithKeys({ it.id.value }, ids)

    fun findAll() = CategoryEntity.all()
}
