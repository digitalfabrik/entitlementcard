package app.ehrenamtskarte.backend.auth.webservice.schema.types

import app.ehrenamtskarte.backend.auth.database.AdministratorEntity

class Administrator(
    val id: Int,
    val email: String,
    val regionId: Int?,
    val role: Role
) {
    companion object {
        fun fromDbEntity(entity: AdministratorEntity): Administrator =
            Administrator(entity.id.value, entity.email, entity.regionId?.value, Role.fromDbValue(entity.role))
    }
}
