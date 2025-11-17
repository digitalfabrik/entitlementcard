package app.ehrenamtskarte.backend.graphql.stores.types

import app.ehrenamtskarte.backend.db.entities.ContactEntity

data class Contact(
    val id: Int,
    val email: String?,
    val telephone: String?,
    val website: String?,
) {
    companion object {
        fun fromDbEntity(entity: ContactEntity) =
            Contact(
                id = entity.id.value,
                email = entity.email,
                telephone = entity.telephone,
                website = entity.website,
            )
    }
}
