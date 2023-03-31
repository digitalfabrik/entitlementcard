package app.ehrenamtskarte.backend.migration.migrations

import app.ehrenamtskarte.backend.migration.Migration
import app.ehrenamtskarte.backend.migration.Statement

internal class V3_AddTestColumn() : Migration() {
    override val migrate: Statement = {
        exec(
            """
            ALTER TABLE applications ADD COLUMN "test" BOOLEAN;
            """.trimIndent(),
        )
    }
}
