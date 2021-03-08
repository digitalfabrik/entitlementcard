package app.ehrenamtskarte.backend.regions.database

import org.jetbrains.exposed.sql.SchemaUtils

fun setupDatabase(executeScript: (path: String) -> Unit) {
    SchemaUtils.create(
        Regions
    )

    executeScript("sql/create_regions.sql")
}
