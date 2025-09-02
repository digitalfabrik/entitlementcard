package app.ehrenamtskarte.backend.db.migration.migrations

import app.ehrenamtskarte.backend.db.migration.Migration
import app.ehrenamtskarte.backend.db.migration.Statement

@Suppress("ClassName")
internal class V0029_Add_Application_Rejection_message : Migration() {
    override val migrate: Statement = {
        exec(
            """
            alter table "applications" add column "rejectionMessage" text null;
            """.trimIndent(),
        )
    }
}
