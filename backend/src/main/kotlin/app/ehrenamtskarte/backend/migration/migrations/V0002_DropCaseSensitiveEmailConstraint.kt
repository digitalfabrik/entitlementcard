package app.ehrenamtskarte.backend.migration.migrations

import app.ehrenamtskarte.backend.migration.Migration
import app.ehrenamtskarte.backend.migration.Statement

/**
 * Drops administrators_email_unique as we already have the unique index email_lower_idx.
 */
@Suppress("ClassName")
internal class V0002_DropCaseSensitiveEmailConstraint() : Migration() {
    override val migrate: Statement = {
        exec(
            """
            ALTER TABLE administrators DROP CONSTRAINT administrators_email_unique;
            """.trimIndent(),
        )
    }
}
