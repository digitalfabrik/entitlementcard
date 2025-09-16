package app.ehrenamtskarte.backend.graphql.stores.types

data class Contact(
    val id: Int,
    val email: String?,
    val telephone: String?,
    val website: String?,
)
