package app.ehrenamtskarte.backend.graphql.stores.types

data class Address(
    val id: Int,
    val street: String?,
    val postalCode: String?,
    val location: String?,
    val state: String?,
)
