package app.ehrenamtskarte.backend.migration.migrations

import app.ehrenamtskarte.backend.migration.Migration
import app.ehrenamtskarte.backend.migration.Statement

/**
 * Adds columns to the region table for a note for the application confirmation mail
 */
@Suppress("ClassName")
internal class V0027_Region_Application_Confirmation_Mail_Note : Migration() {
    override val migrate: Statement = {
        exec(
            """
            ALTER TABLE regions ADD "applicationConfirmationMailNoteActivated" BOOLEAN NOT NULL DEFAULT false;
            ALTER TABLE regions ADD "applicationConfirmationMailNote" varchar(1000) NULL;
            """.trimIndent(),
        )
    }
}
