package app.ehrenamtskarte.backend.migration.migrations

import app.ehrenamtskarte.backend.migration.Migration
import app.ehrenamtskarte.backend.migration.Statement

internal class V0021_AlterTokenHashColumn : Migration() {
    override val migrate: Statement = {
        exec(
            """
                ALTER TABLE apitokens RENAME COLUMN "token" TO "tokenHash";
                ALTER TABLE ONLY apitokens ADD CONSTRAINT apitokens_tokenhash_unique UNIQUE ("tokenHash");
            """.trimIndent()
        )
    }
}
