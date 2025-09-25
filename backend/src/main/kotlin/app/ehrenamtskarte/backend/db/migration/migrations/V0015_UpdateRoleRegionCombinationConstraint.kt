package app.ehrenamtskarte.backend.db.migration.migrations

import app.ehrenamtskarte.backend.db.migration.Migration
import app.ehrenamtskarte.backend.db.migration.Statement

/**
 * Drops and Adds new constraint for roleregioncombination to accept PROJECT_STORE_MANAGER
 */
@Suppress("ClassName")
internal class V0015_UpdateRoleRegionCombinationConstraint : Migration() {
    override val migrate: Statement = {
        exec(
            """
            ALTER TABLE administrators DROP CONSTRAINT roleregioncombinationconstraint;
            ALTER TABLE administrators ADD CONSTRAINT roleregioncombinationconstraint CHECK (((("regionId" IS NULL) AND ((role)::text = ANY ((ARRAY['PROJECT_ADMIN'::character varying, 'NO_RIGHTS'::character varying, 'PROJECT_STORE_MANAGER'::character varying])::text[]))) OR (("regionId" IS NOT NULL) AND ((role)::text = ANY ((ARRAY['REGION_MANAGER'::character varying, 'REGION_ADMIN'::character varying, 'NO_RIGHTS'::character varying])::text[])))));
            """.trimIndent(),
        )
    }
}
