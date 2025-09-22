package app.ehrenamtskarte.backend.db.migration.migrations

import app.ehrenamtskarte.backend.db.migration.Migration
import app.ehrenamtskarte.backend.db.migration.Statement

/**
 * Addes the automaticSource field to the applicationverifications table
 */
@Suppress("ClassName")
internal class V0025_AddSourceFieldToApplicationVerifications : Migration() {
    override val migrate: Statement = {
        exec(
            """
                ALTER TABLE applicationverifications
                ADD COLUMN "automaticSource" VARCHAR(20) NOT NULL DEFAULT 'NONE' CHECK ("automaticSource" IN ('VEREIN360', 'NONE'));
            """.trimIndent(),
        )
    }
}
