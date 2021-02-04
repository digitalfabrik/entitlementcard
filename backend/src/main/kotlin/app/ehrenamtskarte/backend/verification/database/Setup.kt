package app.ehrenamtskarte.backend.verification.database

import org.jetbrains.exposed.sql.SchemaUtils

fun setupDatabase() {
    SchemaUtils.create(
        Cards
    )
}
