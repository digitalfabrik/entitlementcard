package app.ehrenamtskarte.backend.stores.database

fun insertOrUpdateCategories(executeScript: (path: String) -> Unit) {
    executeScript("sql/create_categories.sql")
}

fun createOrReplaceStoreFunctions(executeScript: (path: String) -> Unit) {
    executeScript("sql/martin_setup.sql")
}
