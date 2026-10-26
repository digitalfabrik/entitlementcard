package app.ehrenamtskarte.backend.db.migration.migrations

import app.ehrenamtskarte.backend.db.migration.Migration
import app.ehrenamtskarte.backend.db.migration.Statement

/**
 * Adds the availableCardFormats column to regions.
 * Defaults to DIGITAL_AND_PHYSICAL, so that all existing regions keep offering both card formats.
 */
@Suppress("ClassName")
internal class V0034_AddAvailableCardFormatsToRegions : Migration() {
    override val migrate: Statement = {
        exec(
            """
                ALTER TABLE regions
                ADD COLUMN "availableCardFormats" VARCHAR(30) NOT NULL DEFAULT 'DIGITAL_AND_PHYSICAL' CHECK ("availableCardFormats" IN ('DIGITAL', 'DIGITAL_AND_PHYSICAL'));
            """.trimIndent(),
        )
    }
}
