package app.ehrenamtskarte.backend.verification.database

import org.jetbrains.exposed.sql.SchemaUtils

@ExperimentalUnsignedTypes
fun setupDatabase() {
    SchemaUtils.create(
        Card
    )
}
