package app.ehrenamtskarte.backend.migration.migrations

import app.ehrenamtskarte.backend.auth.database.TOKEN_LENGTH
import app.ehrenamtskarte.backend.migration.Migration
import app.ehrenamtskarte.backend.migration.Statement

internal class V0018_AddUserUploadApiTokenTable: Migration() {
    override val migrate: Statement = {
        exec(
            """
                CREATE TABLE useruploadapitokens (
                    id SERIAL PRIMARY KEY ,
                    "token" BYTEA NOT NULL,
                    "creatorId" INTEGER NOT NULL,
                    "projectId" INTEGER NOT NULL,
                    "expirationDate" DATE NOT NULL
                );
                ALTER TABLE useruploadapitokens ADD CONSTRAINT fk_useruploadapitokens_creator__id FOREIGN KEY ("creatorId") REFERENCES administrators(id) ON DELETE RESTRICT ON UPDATE RESTRICT;
                ALTER TABLE useruploadapitokens ADD CONSTRAINT fk_useruploadapitokens_projectid__id FOREIGN KEY ("projectId") REFERENCES projects(id) ON DELETE RESTRICT ON UPDATE RESTRICT;
            """.trimIndent()
        )
    }
}