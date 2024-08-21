package app.ehrenamtskarte.backend.migration.migrations

import app.ehrenamtskarte.backend.migration.Migration
import app.ehrenamtskarte.backend.migration.Statement

/**
 * Alter unique constraint for the userHash column in the userentitlements table
 */
@Suppress("ClassName")
internal class V0018_SetActivatedForApplicationToFalseForNuernberg() : Migration() {
    override val migrate: Statement = {
        exec(
            """
            UPDATE regions SET "activatedForApplication" = false FROM projects WHERE projects.id = regions."projectId" AND project='nuernberg.sozialpass.app';
            """.trimIndent()
        )
    }
}
