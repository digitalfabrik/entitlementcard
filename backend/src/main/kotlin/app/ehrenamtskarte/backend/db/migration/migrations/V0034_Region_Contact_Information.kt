package app.ehrenamtskarte.backend.db.migration.migrations

import app.ehrenamtskarte.backend.db.migration.Migration
import app.ehrenamtskarte.backend.db.migration.Statement

/**
 * Adds columns to the region table for contact information that is appended to mails sent to applicants
 */
@Suppress("ClassName")
internal class V0034_Region_Contact_Information : Migration() {
    override val migrate: Statement = {
        exec(
            """
            ALTER TABLE regions ADD "contactInformationActivated" BOOLEAN NOT NULL DEFAULT false;
            ALTER TABLE regions ADD "contactInformation" varchar(500) NULL;
            """.trimIndent(),
        )
    }
}
