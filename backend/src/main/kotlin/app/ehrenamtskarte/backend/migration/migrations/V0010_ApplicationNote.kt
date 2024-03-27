package app.ehrenamtskarte.backend.migration.migrations

import app.ehrenamtskarte.backend.migration.Migration
import app.ehrenamtskarte.backend.migration.Statement

/**
 * Change type and name of passwordResetKey column
 */
@Suppress("ClassName")
internal class V0010_ApplicationNote : Migration() {
    override val migrate: Statement = {
        exec(
            """
            ALTER TABLE applications ADD "note" text NULL;
            """.trimIndent()
        )
    }
}
