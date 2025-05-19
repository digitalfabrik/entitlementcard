package app.ehrenamtskarte.backend.stores.database

import app.ehrenamtskarte.backend.common.database.Database

fun insertOrUpdateCategories() {
    Database.executeSqlResource("sql/create_categories.sql")
}

fun createOrReplaceStoreFunctions() {
    Database.executeSqlResource("sql/martin_setup.sql")
}
