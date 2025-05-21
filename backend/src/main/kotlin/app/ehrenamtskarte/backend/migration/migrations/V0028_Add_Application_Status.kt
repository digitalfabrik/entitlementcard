package app.ehrenamtskarte.backend.migration.migrations

import app.ehrenamtskarte.backend.migration.Migration
import app.ehrenamtskarte.backend.migration.Statement

@Suppress("ClassName")
internal class V0028_Add_Application_Status : Migration() {
    override val migrate: Statement = {
        exec(
            """
            -- Add column "status"
            alter table "applications" add column "status" varchar(32) not null default 'Pending'
                 check ("status" in ('Pending', 'Approved', 'ApprovedCardCreated', 'Rejected'));
            -- Set "status" to 'ApprovedCardCreated' for rows that have "cardCreated" set to true
            update "applications" set "status" = 'ApprovedCardCreated' where "cardCreated";
            -- Remove ”cardCreated" column
            alter table "applications" drop column "cardCreated";
            -- Add column "statusResolvedDate"
            alter table "applications" add column "statusResolvedDate" timestamptz default null;
            """.trimIndent(),
        )
    }
}
