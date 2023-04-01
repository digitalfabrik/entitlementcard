package app.ehrenamtskarte.backend.migration.migrations

import app.ehrenamtskarte.backend.migration.Migration
import app.ehrenamtskarte.backend.migration.Statement

internal class V2_FirstProductionMigration() : Migration() {
    override val migrate: Statement = {
        exec(
            """
            ALTER TABLE applications ADD "accessKey" VARCHAR(100) NOT NULL;
            ALTER TABLE applications ADD "withdrawalDate" TIMESTAMP NULL;
            ALTER TABLE applications ADD CONSTRAINT applications_accesskey_unique UNIQUE ("accessKey");
            CREATE UNIQUE INDEX IF NOT EXISTS email_lower_idx ON administrators (lower(email));
            """.trimIndent()
        )
    }
}
