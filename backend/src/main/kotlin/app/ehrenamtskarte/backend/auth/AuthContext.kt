package app.ehrenamtskarte.backend.auth

import app.ehrenamtskarte.backend.auth.database.AdministratorEntity

data class AuthContext(
    val projectName: String,
    val admin: AdministratorEntity,
)
