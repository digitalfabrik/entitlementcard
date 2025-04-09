package app.ehrenamtskarte.backend.migration.migrations

import app.ehrenamtskarte.backend.migration.Migration
import app.ehrenamtskarte.backend.migration.Statement

/**
 * Adds cardCreated column to application table
 */
@Suppress("ClassName")
internal class V0012_AddApplicationCardCreated : Migration() {
    override val migrate: Statement = {
        exec(
            """
            ALTER TABLE applications ADD "cardCreated" BOOLEAN NOT NULL DEFAULT false;
            """.trimIndent(),
        )
    }
}
