package app.ehrenamtskarte.backend.db.migration.migrations

import app.ehrenamtskarte.backend.db.migration.Migration
import app.ehrenamtskarte.backend.db.migration.Statement

/**
 * Add firstActivationDate column to cards.
 * Set current_timestamp for firstActivationDate for existing active cards since we have no firstActivationDate for them.
 */
@Suppress("ClassName")
internal class V0004_AddNotificationSettings : Migration() {
    override val migrate: Statement = {
        exec(
            """
            ALTER TABLE administrators 
            ADD "notificationOnApplication" BOOLEAN NOT NULL DEFAULT false,
            ADD "notificationOnVerification" BOOLEAN NOT NULL DEFAULT false;
            """.trimIndent(),
        )
    }
}
