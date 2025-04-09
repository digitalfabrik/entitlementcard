package app.ehrenamtskarte.backend.migration.migrations

import app.ehrenamtskarte.backend.migration.Migration
import app.ehrenamtskarte.backend.migration.Statement

internal class V0020_AddApiTokenTable : Migration() {
    override val migrate: Statement = {
        exec(
            """
                CREATE TABLE apitokens (
                    id SERIAL PRIMARY KEY ,
                    "token" BYTEA NOT NULL,
                    "creatorId" INTEGER NOT NULL,
                    "projectId" INTEGER NOT NULL,
                    "expirationDate" DATE NOT NULL
                );
                ALTER TABLE apitokens ADD CONSTRAINT fk_apitokens_creator__id FOREIGN KEY ("creatorId") 
                    REFERENCES administrators(id) ON DELETE RESTRICT ON UPDATE RESTRICT;
                ALTER TABLE apitokens ADD CONSTRAINT fk_apitokens_projectid__id FOREIGN KEY ("projectId") 
                    REFERENCES projects(id) ON DELETE RESTRICT ON UPDATE RESTRICT;
            """.trimIndent(),
        )
    }
}
