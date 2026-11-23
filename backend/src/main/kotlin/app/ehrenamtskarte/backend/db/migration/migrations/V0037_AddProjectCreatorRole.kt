package app.ehrenamtskarte.backend.db.migration.migrations

import app.ehrenamtskarte.backend.db.migration.Migration
import app.ehrenamtskarte.backend.db.migration.Statement

/**
 * Adds the PROJECT_CREATOR role, which is not bound to any project.
 * Therefore, projectId becomes nullable, but only for (and required for) project creators.
 */
@Suppress("ClassName")
internal class V0037_AddProjectCreatorRole : Migration() {
    override val migrate: Statement = {
        exec(
            """
            ALTER TABLE administrators ALTER COLUMN "projectId" DROP NOT NULL;
            ALTER TABLE administrators DROP CONSTRAINT roleregioncombinationconstraint;
            ALTER TABLE administrators ADD CONSTRAINT roleregioncombinationconstraint CHECK (((("regionId" IS NULL) AND ((role)::text = ANY ((ARRAY['PROJECT_ADMIN'::character varying, 'NO_RIGHTS'::character varying, 'PROJECT_STORE_MANAGER'::character varying, 'EXTERNAL_VERIFIED_API_USER'::character varying, 'PROJECT_CREATOR'::character varying])::text[]))) OR (("regionId" IS NOT NULL) AND ((role)::text = ANY ((ARRAY['REGION_MANAGER'::character varying, 'REGION_ADMIN'::character varying, 'NO_RIGHTS'::character varying])::text[])))));
            ALTER TABLE administrators ADD CONSTRAINT roleprojectcombinationconstraint CHECK (((("projectId" IS NULL) AND ((role)::text = 'PROJECT_CREATOR'::text)) OR (("projectId" IS NOT NULL) AND ((role)::text <> 'PROJECT_CREATOR'::text))));
            """.trimIndent(),
        )
    }
}
