package app.ehrenamtskarte.backend.migration.migrations

import app.ehrenamtskarte.backend.migration.Migration
import app.ehrenamtskarte.backend.migration.Statement

/**
 * Creates userentitlements table to store koblenz user data
 */
@Suppress("ClassName")
internal class V0014_CreateUserEntitlementsTable : Migration() {
    override val migrate: Statement = {
        exec(
            """
            CREATE TABLE userentitlements (
                id integer NOT NULL,
                "userHash" bytea NOT NULL,
                "startDate" date NOT NULL,
                "endDate" date NOT NULL,
                "revoked" boolean NOT NULL,
                "regionId" integer NOT NULL,
                "lastUpdated" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
            );            
            
            CREATE SEQUENCE userentitlements_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
                        
            ALTER SEQUENCE userentitlements_id_seq OWNED BY userentitlements.id;
            
            ALTER TABLE ONLY userentitlements ALTER COLUMN id SET DEFAULT nextval('userentitlements_id_seq'::regclass);
            
            ALTER TABLE ONLY userentitlements ADD CONSTRAINT userentitlements_pkey PRIMARY KEY (id);
            
            ALTER TABLE ONLY userentitlements
                ADD CONSTRAINT fk_userentitlements_regionId__id FOREIGN KEY ("regionId") REFERENCES regions(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
                
            ALTER TABLE userentitlements ADD CONSTRAINT unique_userhash_regionid UNIQUE ("userHash", "regionId");
            """.trimIndent(),
        )
    }
}
