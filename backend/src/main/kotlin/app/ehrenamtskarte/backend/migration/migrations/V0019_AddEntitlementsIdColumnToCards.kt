package app.ehrenamtskarte.backend.migration.migrations

import app.ehrenamtskarte.backend.migration.Migration
import app.ehrenamtskarte.backend.migration.Statement

/**
 * Add the entitlementsId column to the cards table
 */
@Suppress("ClassName")
internal class V0019_AddEntitlementsIdColumnToCards : Migration() {
    override val migrate: Statement = {
        exec(
            """            
            ALTER TABLE cards ADD "entitlementsId" INT NULL;
            
            ALTER TABLE cards ADD CONSTRAINT fk_cards_entitlementsid__id 
            FOREIGN KEY ("entitlementsId") REFERENCES userentitlements(id) ON DELETE RESTRICT ON UPDATE RESTRICT;
            
            ALTER TABLE cards ADD CONSTRAINT issuerid_or_entitlementsid_not_null 
            CHECK ((("issuerId" IS NOT NULL) AND ("entitlementsId" IS NULL)) OR (("issuerId" IS NULL) AND ("entitlementsId" IS NOT NULL)))
            """.trimIndent()
        )
    }
}
