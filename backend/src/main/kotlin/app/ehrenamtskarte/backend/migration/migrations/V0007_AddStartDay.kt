package app.ehrenamtskarte.backend.migration.migrations

import app.ehrenamtskarte.backend.migration.Migration
import app.ehrenamtskarte.backend.migration.Statement

/**
 * Add startDay column to cards. startDay can be null.
 */
@Suppress("ClassName")
internal class V0007_AddStartDay : Migration() {
    override val migrate: Statement = {
        exec(
            """
            ALTER TABLE cards ADD "startDay" BIGINT NULL;
            """.trimIndent(),
        )
    }
}
