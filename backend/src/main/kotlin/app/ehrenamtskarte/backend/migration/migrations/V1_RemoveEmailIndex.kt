package app.ehrenamtskarte.backend.migration.migrations

import app.ehrenamtskarte.backend.migration.Migration
import org.jetbrains.exposed.sql.transactions.TransactionManager
import org.jetbrains.exposed.sql.transactions.transaction

internal class V1_RemoveEmailIndex : Migration() {
    val indexName = "email_lower_idx"

    override fun run() {
        transaction {
            val dropStatement = "drop index $indexName"
            TransactionManager.current().exec(dropStatement)
        }
    }
}
