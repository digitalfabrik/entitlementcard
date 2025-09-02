package app.ehrenamtskarte.backend.migration

import app.ehrenamtskarte.backend.db.entities.Migrations
import app.ehrenamtskarte.backend.migration.migrations.MigrationsRegistry
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.transactions.TransactionManager
import org.jetbrains.exposed.sql.vendors.currentDialect

class DatabaseOutOfSyncException(suggestedMigrationStatements: List<String>? = null, comment: String? = null) :
    Exception(
        run {
            var message = ""
            if (comment != null) {
                message += "\n$comment"
            }
            if (suggestedMigrationStatements != null) {
                message += "\nThe following migrations are suggested:\n--- START OF SUGGESTED MIGRATIONS\n" +
                    suggestedMigrationStatements.joinToString("\n") { "$it;" } +
                    "\n--- END OF SUGGESTED MIGRATIONS"
            }
            message
        },
    )

fun assertDatabaseIsInSync() {
    val allTables = TablesRegistry.getAllTables()
    val allMigrations = MigrationsRegistry.getAllMigrations()
    val versionDb = Migrations.getCurrentVersionOrNull()
    val versionCode = allMigrations.maxOfOrNull { it.version }

    if (versionCode != versionDb) {
        throw DatabaseOutOfSyncException(
            comment = "Latest migration versions do not match: Version on DB $versionDb - Code Version $versionCode",
        )
    }

    var outOfSyncComment: String? = null

    // Check if all tables in the DB appear in `allTables` and vice versa. We ignore spatial_ref_sys.
    val tablesInDb = currentDialect
        .allTablesNames().map { it.substringAfter(".") }
        .filter { it != "spatial_ref_sys" }
        .toSet()
    val tablesInCode = allTables.map { it.nameInDatabaseCase() }.toSet()

    if (tablesInDb != tablesInCode) {
        val tablesNotInCode = tablesInDb - tablesInCode
        val tablesNotInDb = tablesInCode - tablesInDb

        outOfSyncComment = "List of tables is out sync with database:"

        if (tablesNotInCode.isNotEmpty()) {
            outOfSyncComment += "\nUnknown tables found in DB: $tablesNotInCode"
        }
        if (tablesNotInDb.isNotEmpty()) {
            outOfSyncComment += "\nTables missing in DB: $tablesNotInDb"
        }
    }

    val statements = SchemaUtils.statementsRequiredToActualizeScheme(*allTables) + dropExcessiveColumns(*allTables)
    if (statements.isNotEmpty() || outOfSyncComment != null) {
        throw DatabaseOutOfSyncException(statements, comment = outOfSyncComment)
    }
}

/**
 * Checks whether there exist any excessive columns for the passed tables.
 * Returns a list of SQL statements to drop these excessive columns.
 */
private fun dropExcessiveColumns(vararg tables: Table): List<String> {
    val transaction = TransactionManager.current()

    val statements = mutableListOf<String>()
    val existingColumnsByTable = currentDialect.tableColumns(*tables)
    for (table in tables) {
        val columns = existingColumnsByTable[table] ?: continue
        for (column in columns) {
            val columnInCode = table.columns.singleOrNull { it.name.equals(column.name, ignoreCase = true) }
            if (columnInCode == null) {
                statements += "ALTER TABLE ${transaction.identity(table)} DROP ${column.name}"
            }
        }
    }

    return statements
}
