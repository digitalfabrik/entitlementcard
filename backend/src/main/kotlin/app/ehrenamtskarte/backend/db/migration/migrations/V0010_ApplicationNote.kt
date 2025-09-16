package app.ehrenamtskarte.backend.db.migration.migrations

import app.ehrenamtskarte.backend.db.migration.Migration
import app.ehrenamtskarte.backend.db.migration.Statement

/**
 * Adds note column to application table
 */
@Suppress("ClassName")
internal class V0010_ApplicationNote : Migration() {
    override val migrate: Statement = {
        exec(
            """
            ALTER TABLE applications ADD "note" varchar(1000) NULL;
            """.trimIndent(),
        )
    }
}
