package app.ehrenamtskarte.backend.stores.database

import org.jetbrains.exposed.sql.SchemaUtils

fun setupDatabase(executeScript: (path: String) -> Unit) {
    SchemaUtils.create(
        Categories,
        Contacts,
        AcceptingStores,
        PhysicalStores,
        Addresses
    )

    executeScript("sql/martin_setup.sql")
    executeScript("sql/create_categories.sql")
}
