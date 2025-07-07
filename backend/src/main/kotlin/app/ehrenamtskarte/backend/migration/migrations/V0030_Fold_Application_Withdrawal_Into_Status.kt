package app.ehrenamtskarte.backend.migration.migrations

import app.ehrenamtskarte.backend.migration.Migration
import app.ehrenamtskarte.backend.migration.Statement

@Suppress("ClassName")
internal class V0030_Fold_Application_Withdrawal_Into_Status : Migration() {
    override val migrate: Statement = {
        exec(
            """
            -- Widen constraint
            alter table "applications" 
                drop constraint "applications_status_check",
                add constraint "applications_status_check" check (
                    "status" in ('Pending', 'Approved', 'ApprovedCardCreated', 'Rejected', 'Withdrawn')
                );
            -- Fold withdrawals into "status" 
            update "applications" set 
                "status" = 'Withdrawn',
                "statusResolvedDate" = "withdrawalDate"
                where "withdrawalDate" is not null;
            -- Remove "withdrawalDate" column
            alter table "applications" drop column "withdrawalDate";
            """.trimIndent(),
        )
    }
}
