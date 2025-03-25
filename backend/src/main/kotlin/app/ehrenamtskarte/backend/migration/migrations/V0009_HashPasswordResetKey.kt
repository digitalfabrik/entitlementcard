package app.ehrenamtskarte.backend.migration.migrations

import app.ehrenamtskarte.backend.migration.Migration
import app.ehrenamtskarte.backend.migration.Statement

/**
 * Change type and name of passwordResetKey column
 */
@Suppress("ClassName")
internal class V0009_HashPasswordResetKey : Migration() {
    override val migrate: Statement = {
        exec(
            """
            UPDATE administrators SET "passwordResetKeyExpiry" = null WHERE "passwordResetKey" IS NOT NULL;
            ALTER TABLE administrators ALTER COLUMN "passwordResetKey" TYPE bytea USING NULL;
            ALTER TABLE administrators RENAME COLUMN "passwordResetKey" TO "passwordResetKeyHash";
            """.trimIndent(),
        )
    }
}
