package app.ehrenamtskarte.backend.auth.webservice.schema.types

class Administrator(
    val id: Int,
    val email: String,
    val regionId: Int?,
    val role: Role
)
