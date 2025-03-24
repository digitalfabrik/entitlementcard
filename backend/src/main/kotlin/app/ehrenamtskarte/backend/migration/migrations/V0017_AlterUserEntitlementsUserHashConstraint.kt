package app.ehrenamtskarte.backend.migration.migrations

import app.ehrenamtskarte.backend.migration.Migration
import app.ehrenamtskarte.backend.migration.Statement

/**
 * Alter unique constraint for the userHash column in the userentitlements table
 */
@Suppress("ClassName")
internal class V0017_AlterUserEntitlementsUserHashConstraint() : Migration() {
    override val migrate: Statement = {
        exec(
            """
            ALTER TABLE userentitlements DROP CONSTRAINT unique_userhash_regionid;
            ALTER TABLE userentitlements ADD CONSTRAINT userentitlements_userhash_unique UNIQUE ("userHash");
            """.trimIndent(),
        )
    }
}
