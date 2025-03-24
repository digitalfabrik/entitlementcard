package app.ehrenamtskarte.backend.migration.migrations

import app.ehrenamtskarte.backend.migration.Migration
import app.ehrenamtskarte.backend.migration.Statement

/**
 * Add firstActivationDate column to cards.
 * Set current_timestamp for firstActivationDate for existing active cards since we have no firstActivationDate for them.
 */
@Suppress("ClassName")
internal class V0005_AddRegionApplicationActivation() : Migration() {
    override val migrate: Statement = {
        exec(
            """
            ALTER TABLE regions 
            ADD "activatedForApplication" BOOLEAN NOT NULL DEFAULT true;
            """.trimIndent(),
        )
    }
}
