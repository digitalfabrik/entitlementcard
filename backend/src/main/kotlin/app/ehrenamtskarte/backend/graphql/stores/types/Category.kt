package app.ehrenamtskarte.backend.graphql.stores.types

import app.ehrenamtskarte.backend.db.entities.CategoryEntity

data class Category(
    val id: Int,
    val name: String,
) {
    companion object {
        fun fromDbEntity(entity: CategoryEntity) =
            Category(
                id = entity.id.value,
                name = entity.name,
            )
    }
}
