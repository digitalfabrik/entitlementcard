package app.ehrenamtskarte.backend.auth.database

import org.jetbrains.exposed.sql.SchemaUtils

fun setupDatabase() {
    SchemaUtils.create(
        Administrators
    )
}
