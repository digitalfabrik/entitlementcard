package xyz.elitese.ehrenamtskarte.database.repos

import xyz.elitese.ehrenamtskarte.database.Categories
import xyz.elitese.ehrenamtskarte.database.CategoryEntity

object CategoriesRepository {

    fun findByIds(ids: List<Int>) = ids.map { CategoryEntity.findById(it) }

    fun findAll() = CategoryEntity.all()
}
