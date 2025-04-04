package app.ehrenamtskarte.backend.migration.migrations

import app.ehrenamtskarte.backend.migration.Migration
import app.ehrenamtskarte.backend.migration.Statement

/**
 * Set the expirationDay to null for gold cards where the expirationDay was accidentally set to 0.
 */
@Suppress("ClassName")
internal class V0013_FixExpirationDateGoldCard : Migration() {
    override val migrate: Statement = {
        exec(
            """
            UPDATE cards
            SET "expirationDay" = null
            WHERE "expirationDay" = 0;
            """.trimIndent(),
        )
    }
}
