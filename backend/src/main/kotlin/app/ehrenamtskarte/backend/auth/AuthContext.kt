package app.ehrenamtskarte.backend.auth

import app.ehrenamtskarte.backend.db.entities.AdministratorEntity

data class AuthContext(
    val adminId: Int,
    val admin: AdministratorEntity,
    val projectId: Int,
    val project: String,
)
