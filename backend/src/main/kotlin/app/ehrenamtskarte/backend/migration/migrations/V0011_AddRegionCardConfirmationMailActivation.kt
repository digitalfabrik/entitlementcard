package app.ehrenamtskarte.backend.migration.migrations

import app.ehrenamtskarte.backend.migration.Migration
import app.ehrenamtskarte.backend.migration.Statement

/**
 * Add activatedForCardConfirmationMail column to regions.
 * Set default to false.
 */
@Suppress("ClassName")
internal class V0011_AddRegionCardConfirmationMailActivation() : Migration() {
    override val migrate: Statement = {
        exec(
            """
            ALTER TABLE regions 
            ADD "activatedForCardConfirmationMail" BOOLEAN NOT NULL DEFAULT false;
            """.trimIndent(),
        )
    }
}
