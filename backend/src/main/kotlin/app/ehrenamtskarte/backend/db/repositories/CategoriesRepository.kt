package app.ehrenamtskarte.backend.db.repositories

import app.ehrenamtskarte.backend.db.entities.Categories
import app.ehrenamtskarte.backend.db.entities.CategoryEntity
import app.ehrenamtskarte.backend.shared.database.sortByKeys
import org.jetbrains.exposed.v1.core.inList

object CategoriesRepository {
    fun findByIds(ids: List<Int>) = CategoryEntity.find { Categories.id inList ids }.sortByKeys({ it.id.value }, ids)

    fun findAll() = CategoryEntity.all()
}
