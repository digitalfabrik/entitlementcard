package app.ehrenamtskarte.backend.migration.migrations

import app.ehrenamtskarte.backend.migration.Migration
import app.ehrenamtskarte.backend.migration.Statement

/**
 * Increase email varchar length to 254.
 */
@Suppress("ClassName")
internal class V0008_IncreaseAdministratorEmailLength : Migration() {
    override val migrate: Statement = {
        exec(
            """
            ALTER TABLE administrators ALTER COLUMN "email" TYPE character varying(254);
            """.trimIndent(),
        )
    }
}
