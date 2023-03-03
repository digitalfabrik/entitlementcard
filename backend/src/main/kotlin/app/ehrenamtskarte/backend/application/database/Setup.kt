package app.ehrenamtskarte.backend.application.database

import org.jetbrains.exposed.sql.SchemaUtils

fun setupDatabase() {
    SchemaUtils.create(
        Applications,
        ApplicationVerifications,
    )
}
