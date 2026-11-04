package app.ehrenamtskarte.backend.db.migration.migrations

import app.ehrenamtskarte.backend.db.migration.Migration
import app.ehrenamtskarte.backend.db.migration.Statement

/**
 * Applications created before 09/2023 store all fields except "personalData" at the top level of the application json.
 * This migration moves these fields into an "applicationDetails" array, so legacy applications match the current format:
 * [personalData, cardType, applicationType, ...] -> [personalData, applicationDetails: [cardType, applicationType, ...]]
 * The order of the moved fields is preserved.
 */
@Suppress("ClassName")
internal class V0034_MoveLegacyApplicationFieldsIntoApplicationDetails : Migration() {
    override val migrate: Statement = {
        exec(
            """
            UPDATE applications a
            SET "jsonValue" = jsonb_set(
                a."jsonValue"::jsonb,
                '{value}',
                (
                    SELECT
                        coalesce(
                            jsonb_agg(e.elem ORDER BY e.ord) FILTER (WHERE e.elem ->> 'name' = 'personalData'),
                            '[]'::jsonb
                        )
                        || jsonb_build_array(
                            jsonb_build_object(
                                'name', 'applicationDetails',
                                'type', 'Array',
                                'value', coalesce(
                                    jsonb_agg(e.elem ORDER BY e.ord) FILTER (WHERE e.elem ->> 'name' <> 'personalData'),
                                    '[]'::jsonb
                                )
                            )
                        )
                    FROM jsonb_array_elements(a."jsonValue"::jsonb -> 'value') WITH ORDINALITY AS e(elem, ord)
                )
            )::text
            WHERE NOT (a."jsonValue"::jsonb -> 'value') @> '[{"name": "applicationDetails"}]';
            """.trimIndent(),
        )
    }
}
