package app.ehrenamtskarte.backend.db.migration.migrations

import app.ehrenamtskarte.backend.db.migration.Migration
import app.ehrenamtskarte.backend.db.migration.Statement

internal class V0023_DropTypeDefaultOfApiToken : Migration() {
    override val migrate: Statement = {
        exec(
            """
                ALTER TABLE apitokens ALTER COLUMN type DROP DEFAULT;
            """.trimIndent(),
        )
    }
}
