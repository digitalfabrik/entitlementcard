package app.ehrenamtskarte.backend.db.migration.migrations

import app.ehrenamtskarte.backend.db.migration.Migration
import app.ehrenamtskarte.backend.db.migration.Statement

@Suppress("ClassName")
internal class V0031_AddAcceptingStoreDescriptionsTable : Migration() {
    override val migrate: Statement = {
        exec(
            """
            CREATE TABLE acceptingstoredescriptions (
                id SERIAL PRIMARY KEY,
                "storeId" integer NOT NULL,
                "language" character varying(2) NOT NULL,
                "description" character varying(2500)
            );
            
            ALTER TABLE acceptingstoredescriptions 
            ADD CONSTRAINT fk_acceptingstoredescriptions_storeid__id FOREIGN KEY ("storeId") 
            REFERENCES acceptingstores(id) ON DELETE RESTRICT ON UPDATE RESTRICT;
            """.trimIndent(),
        )
    }
}
