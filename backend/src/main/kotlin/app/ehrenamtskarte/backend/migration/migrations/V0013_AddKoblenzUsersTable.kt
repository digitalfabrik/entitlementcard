package app.ehrenamtskarte.backend.migration.migrations

import app.ehrenamtskarte.backend.migration.Migration
import app.ehrenamtskarte.backend.migration.Statement

/**
 * Creates koblenzusers table to store koblenz user data
 */
@Suppress("ClassName")
internal class V0013_AddKoblenzUsersTable : Migration() {
    override val migrate: Statement = {
        exec(
            """
            CREATE TABLE koblenzusers (
                                                          id integer NOT NULL,
                                                          "userHash" bytea NOT NULL,
                                                          "startDate" timestamp without time zone NOT NULL,
                                                          "endDate" timestamp without time zone NOT NULL,
                                                          "valid" boolean NOT NULL,
                                                          "lastUpdated" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
            );            
            
            CREATE SEQUENCE koblenzusers_id_seq
                            AS integer
                            START WITH 1
                            INCREMENT BY 1
                            NO MINVALUE
                            NO MAXVALUE
                            CACHE 1;
                        
            ALTER SEQUENCE koblenzusers_id_seq OWNED BY koblenzusers.id;
            
            ALTER TABLE ONLY koblenzusers ALTER COLUMN id SET DEFAULT nextval('koblenzusers_id_seq'::regclass);
            
            ALTER TABLE ONLY koblenzusers ADD CONSTRAINT koblenzusers_pkey PRIMARY KEY (id);
            """.trimIndent()
        )
    }
}
