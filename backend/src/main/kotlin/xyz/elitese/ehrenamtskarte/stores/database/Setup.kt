package xyz.elitese.ehrenamtskarte.stores.database

import org.jetbrains.exposed.sql.SchemaUtils

fun setupDatabase(executeScript: (path: String) -> Unit) {
    SchemaUtils.create(
        Categories,
        Contacts,
        AcceptingStores,
        PhysicalStores,
        Addresses
    )

    executeScript("sql/create_tilebbox.sql")
    executeScript("sql/create_physical_stores_clustered.sql")
    executeScript("sql/create_physical_stores.sql")
}
