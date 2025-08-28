package app.ehrenamtskarte.backend.auth

import app.ehrenamtskarte.backend.auth.database.AdministratorEntity

data class AuthContext(
    val adminId: Int,
    val admin: AdministratorEntity,
    val projectId: Int,
    val project: String,
)
