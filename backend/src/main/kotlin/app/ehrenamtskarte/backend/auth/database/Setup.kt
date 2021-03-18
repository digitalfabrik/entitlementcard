package app.ehrenamtskarte.backend.auth.database

import app.ehrenamtskarte.backend.auth.database.repos.AdministratorsRepository
import org.jetbrains.exposed.sql.SchemaUtils

fun setupDatabase() {
    SchemaUtils.create(
        Administrators
    )
    if (AdministratorEntity.count() == 0L) {
        AdministratorsRepository.insert("admin@example.com", "admin")
    }
}
