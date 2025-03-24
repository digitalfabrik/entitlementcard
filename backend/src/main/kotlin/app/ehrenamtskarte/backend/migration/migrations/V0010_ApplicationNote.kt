package app.ehrenamtskarte.backend.migration.migrations

import app.ehrenamtskarte.backend.migration.Migration
import app.ehrenamtskarte.backend.migration.Statement

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
