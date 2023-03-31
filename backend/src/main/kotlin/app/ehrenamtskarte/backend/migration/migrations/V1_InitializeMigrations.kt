package app.ehrenamtskarte.backend.migration.migrations

import app.ehrenamtskarte.backend.migration.Migration
import app.ehrenamtskarte.backend.migration.Statement

internal class V1_InitializeMigrations : Migration() {
    override val migrate: Statement = {
        exec(
            """
            CREATE TABLE IF NOT EXISTS migrations ("version" INT PRIMARY KEY, "name" VARCHAR(400) NOT NULL, executed_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP) NOT NULL);
            CREATE INDEX migrations_name ON migrations ("name");
            """.trimIndent(),
        )
    }
}
