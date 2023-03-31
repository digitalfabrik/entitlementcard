package app.ehrenamtskarte.backend.migration.migrations

import app.ehrenamtskarte.backend.migration.Migration
import app.ehrenamtskarte.backend.migration.Statement

internal class V4_RemoveTestColumn() : Migration() {
    override val migrate: Statement = {
        exec(
            """
            ALTER TABLE applications DROP test;
            """.trimIndent(),
        )
    }
}
