package app.ehrenamtskarte.backend.migration.database

import org.jetbrains.exposed.sql.SchemaUtils

fun setupDatabase() {
    SchemaUtils.create(
        Migrations,
    )
}
