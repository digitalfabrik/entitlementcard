package app.ehrenamtskarte.backend.migration.migrations

import app.ehrenamtskarte.backend.migration.Migration
import app.ehrenamtskarte.backend.migration.Statement

/**
 * Adds a created-date column to the accepting stores.
 * This is possible due to the new approach of diffing the imported stores
 * (instead of deleting & reinserting all every time).
 */
@Suppress("ClassName")
internal class V0006_AddStoreCreatedDate : Migration() {
    override val migrate: Statement = {
        exec(
            """
            ALTER TABLE acceptingstores
            ADD "createdDate" TIMESTAMP DEFAULT (CURRENT_TIMESTAMP) NOT NULL;
            """.trimIndent(),
        )
    }
}
