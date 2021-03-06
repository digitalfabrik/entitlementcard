package app.ehrenamtskarte.backend.stores.webservice.schema.types


data class Region(
    val id: Int,
    val prefix: String,
    val name: String,
    val regionIdentifier: String
)
