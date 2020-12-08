package xyz.elitese.ehrenamtskarte.database.repos

import org.jetbrains.exposed.sql.SqlExpressionBuilder.inList
import xyz.elitese.ehrenamtskarte.database.Categories
import xyz.elitese.ehrenamtskarte.database.CategoryEntity

object CategoriesRepository {

    fun findByIds(ids: List<Int>) = CategoryEntity.find {
        Categories.id inList ids
    }

}
