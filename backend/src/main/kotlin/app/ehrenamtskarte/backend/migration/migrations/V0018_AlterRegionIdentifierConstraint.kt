package app.ehrenamtskarte.backend.migration.migrations

import app.ehrenamtskarte.backend.migration.Migration
import app.ehrenamtskarte.backend.migration.Statement

/**
 * Adjust regionidentifier_unique constraint to allow regions with the same identifier across different projects
 */
@Suppress("ClassName")
internal class V0018_AlterRegionIdentifierConstraint : Migration() {
    override val migrate: Statement = {
        exec(
            """
            ALTER TABLE regions DROP CONSTRAINT regions_regionidentifier_unique;
            UPDATE regions SET "regionIdentifier" = '00000' WHERE "regionIdentifier" IS NULL;
            ALTER TABLE regions ALTER COLUMN "regionIdentifier" SET NOT NULL;
            ALTER TABLE regions ADD CONSTRAINT unique_projectid_regionidentifier UNIQUE ("projectId", "regionIdentifier");
            """.trimIndent(),
        )
    }
}
