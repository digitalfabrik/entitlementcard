package app.ehrenamtskarte.backend.db.migration.migrations

import app.ehrenamtskarte.backend.db.migration.Migration
import app.ehrenamtskarte.backend.db.migration.Statement

/**
 * Add the entitlementId column to the cards table
 */
@Suppress("ClassName")
internal class V0019_AddEntitlementIdColumnToCards : Migration() {
    override val migrate: Statement = {
        exec(
            """            
            ALTER TABLE cards ADD "entitlementId" INT NULL;
            
            ALTER TABLE cards ADD CONSTRAINT fk_cards_entitlementid__id 
            FOREIGN KEY ("entitlementId") REFERENCES userentitlements(id) ON DELETE RESTRICT ON UPDATE RESTRICT;
            
            ALTER TABLE cards ADD CONSTRAINT issuerid_or_entitlementid_not_null 
            CHECK ((("issuerId" IS NOT NULL) AND ("entitlementId" IS NULL)) OR (("issuerId" IS NULL) AND ("entitlementId" IS NOT NULL)))
            """.trimIndent(),
        )
    }
}
