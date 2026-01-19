package app.ehrenamtskarte.backend.db.migration.migrations

import app.ehrenamtskarte.backend.db.migration.Migration
import app.ehrenamtskarte.backend.db.migration.Statement

@Suppress("ClassName")
internal class V0032_AddUniqueIndexForAcceptingStoreDescriptionsTable : Migration() {
    override val migrate: Statement = {
        exec(
            """
            ALTER TABLE acceptingstoredescriptions ADD CONSTRAINT acceptingstoredescriptions_storeid_language_unique UNIQUE ("storeId", "language");
            DROP INDEX "acceptingstoredescriptions_storeid_idx";
            """.trimIndent(),
        )
    }
}
