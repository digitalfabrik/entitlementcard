package app.ehrenamtskarte.backend.db.migration.migrations

import app.ehrenamtskarte.backend.db.migration.Migration
import app.ehrenamtskarte.backend.db.migration.Statement

/**
 * Add firstActivationDate column to cards.
 * Set current_timestamp for firstActivationDate for existing active cards since we have no firstActivationDate for them.
 */
@Suppress("ClassName")
internal class V0003_AddFirstActivationDate : Migration() {
    override val migrate: Statement = {
        exec(
            """
            ALTER TABLE cards ADD "firstActivationDate" TIMESTAMP NULL;
            
            UPDATE cards
            SET "firstActivationDate" = CURRENT_TIMESTAMP
            WHERE "totpSecret" IS NOT NULL;
            """.trimIndent(),
        )
    }
}
