package app.ehrenamtskarte.backend.stores.webservice.schema.types

data class Contact(
    val id: Int,
    val email: String?,
    val telephone: String?,
    val website: String?,
)
