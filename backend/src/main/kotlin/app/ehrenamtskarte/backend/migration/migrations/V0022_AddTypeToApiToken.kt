package app.ehrenamtskarte.backend.migration.migrations

import app.ehrenamtskarte.backend.migration.Migration
import app.ehrenamtskarte.backend.migration.Statement

internal class V0022_AddTypeToApiToken : Migration() {
    override val migrate: Statement = {
        exec(
            """
                ALTER TABLE apitokens
                ADD COLUMN type VARCHAR(50) NOT NULL DEFAULT 'USER_IMPORT' CHECK (type IN ('USER_IMPORT', 'VERIFIED_APPLICATION'));
            """.trimIndent()
        )
    }
}
