package xyz.elitese.ehrenamtskarte.database.repos

import xyz.elitese.ehrenamtskarte.database.Categories
import xyz.elitese.ehrenamtskarte.database.CategoryEntity

object CategoriesRepository {

    fun findByIds(ids: List<Int>) = CategoryEntity.find {
        Categories.id inList ids
    }
    
    fun findAll() = CategoryEntity.all()
}
