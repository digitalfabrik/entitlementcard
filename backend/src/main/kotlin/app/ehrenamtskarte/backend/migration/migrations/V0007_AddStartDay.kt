package app.ehrenamtskarte.backend.migration.migrations

import app.ehrenamtskarte.backend.migration.Migration
import app.ehrenamtskarte.backend.migration.Statement

/**
 * Add firstActivationDate column to cards.
 * Set current_timestamp for firstActivationDate for existing active cards since we have no firstActivationDate for them.
 */
@Suppress("ClassName")
internal class V0007_AddStartDay() : Migration() {
    override val migrate: Statement = {
        exec(
            """
            ALTER TABLE cards ADD "startDay" BIGINT NULL;
            """.trimIndent()
        )
    }
}
