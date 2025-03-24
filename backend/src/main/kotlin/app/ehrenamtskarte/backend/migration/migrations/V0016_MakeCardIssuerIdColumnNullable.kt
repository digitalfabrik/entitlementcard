package app.ehrenamtskarte.backend.migration.migrations

import app.ehrenamtskarte.backend.migration.Migration
import app.ehrenamtskarte.backend.migration.Statement

/**
 * Make the issuerId column in the cards table nullable for cards created through the self-service portal
 */
@Suppress("ClassName")
internal class V0016_MakeCardIssuerIdColumnNullable() : Migration() {
    override val migrate: Statement = {
        exec(
            """
            ALTER TABLE cards ALTER COLUMN "issuerId" TYPE INT, ALTER COLUMN "issuerId" DROP NOT NULL;
            """.trimIndent(),
        )
    }
}
