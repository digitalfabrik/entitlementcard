package app.ehrenamtskarte.backend.db.migration.migrations

import app.ehrenamtskarte.backend.db.migration.Migration
import app.ehrenamtskarte.backend.db.migration.Statement

@Suppress("ClassName")
internal class V0001_Baseline : Migration() {
    override val migrate: Statement = {
        exec(
            """
            CREATE FUNCTION physical_stores(z integer, x integer, y integer, query_params json) RETURNS bytea
                LANGUAGE plpgsql IMMUTABLE STRICT PARALLEL SAFE
            AS ${'$'}${'$'}
            DECLARE
                -- DEPRECATED: Fallback only used in old ehrenamtskarten app, released January, 2021
                project_id text = CASE WHEN query_params::jsonb ? 'project_id' THEN (query_params->>'project_id')::text ELSE 'bayern.ehrenamtskarte.app' END;
            BEGIN
            
                IF ((query_params->>'clustered')::boolean) THEN
                    RETURN physical_stores_clusters(z, x, y, project_id);
                ELSE
                    RETURN physical_stores_points(z, x, y, project_id);
                END IF;
            END
            ${'$'}${'$'};
                        
            CREATE FUNCTION physical_stores_clustered(z integer, x integer, y integer, query_params json) RETURNS bytea
                LANGUAGE plpgsql IMMUTABLE STRICT PARALLEL SAFE
            AS ${'$'}${'$'}
            DECLARE
                -- DEPRECATED: Fallback only used in old ehrenamtskarten app, released January, 2021
                project_id text = CASE WHEN query_params::jsonb ? 'project_id' THEN (query_params->>'project_id')::text ELSE 'bayern.ehrenamtskarte.app' END;
            BEGIN
                RETURN physical_stores_clusters(z, x, y, project_id);
            END
            ${'$'}${'$'};
            
            CREATE FUNCTION physical_stores_clusters(z integer, x integer, y integer, project_id text) RETURNS bytea
                LANGUAGE plpgsql IMMUTABLE STRICT PARALLEL SAFE
            AS ${'$'}${'$'}
            DECLARE
                clip_geom     boolean  = false;
                buffer        integer  = 64;
                extend        integer  = 4096;
                mvt           bytea;
                cluster_k     integer  = 3;
                tile_bbox     geometry = TileBBox(z, x, y, 4326);
            BEGIN
                SELECT INTO mvt ST_AsMVT(tile, 'physical_stores_clustered', extend, 'mvt_geom')
                FROM (
                         WITH locations AS (
                             SELECT store.coordinates
                             FROM physicalstores store
                                      JOIN acceptingstores ON acceptingstores.id = store."storeId"
                                      JOIN projects ON projects.id = acceptingstores."projectId"
                             WHERE store.coordinates && tile_bbox AND projects.project = project_id
                         ),
                              k AS (
                                  SELECT CAST(LEAST(cluster_k, COUNT(*)) AS int)
                                  FROM locations
                              ),
                              clusters AS (
                                  SELECT ST_ClusterKMeans(locations.coordinates, (SELECT * FROM k))
                                         OVER () AS cluster_index,
                                         locations.coordinates
                                  FROM locations
                              )
                         SELECT cluster_index,
                                count(*) AS cluster_count,
                                ST_AsMVTGeom(
                                        ST_CENTROID(ST_COLLECT(clusters.coordinates)), tile_bbox, extend, buffer,
                                        clip_geom
                                    )    AS mvt_geom
                         FROM clusters
                         GROUP BY cluster_index) AS tile
                WHERE mvt_geom IS NOT NULL;
            
                RETURN mvt;
            END
            ${'$'}${'$'};
            
            CREATE FUNCTION physical_stores_points(z integer, x integer, y integer, project_id text) RETURNS bytea
                LANGUAGE plpgsql IMMUTABLE STRICT PARALLEL SAFE
            AS ${'$'}${'$'}
            DECLARE
                clip_geom boolean = false;
                buffer    integer = 64;
                extend    integer = 4096;
                mvt       bytea;
            BEGIN
                SELECT INTO mvt ST_AsMVT(tile, 'physical_stores', 4096, 'mvt_geom')
                FROM (
                         SELECT ST_AsMVTGeom(ST_Transform(coordinates, 3857), TileBBox(z, x, y, 3857), extend, buffer,
                                             clip_geom) AS mvt_geom,
                                physicalstores.id,
                                acceptingstores."categoryId"
                         FROM physicalstores
                                  JOIN acceptingstores ON acceptingstores.id = physicalstores."storeId"
                                  JOIN projects ON projects.id = acceptingstores."projectId"
                         WHERE coordinates && TileBBox(z, x, y, 4326) AND projects.project = project_id
                         LIMIT 100
                     ) as tile
                WHERE mvt_geom IS NOT NULL;
            
                RETURN mvt;
            END
            ${'$'}${'$'};
            
            CREATE FUNCTION tilebbox(z integer, x integer, y integer, srid integer DEFAULT 3857) RETURNS geometry
                LANGUAGE plpgsql IMMUTABLE
            AS ${'$'}${'$'}
            declare
                max  numeric := 20037508.34;
                res  numeric := (max * 2) / (2 ^ z);
                bbox geometry;
            begin
                bbox := ST_MakeEnvelope(
                            -max + (x * res),
                            max - (y * res),
                            -max + (x * res) + res,
                            max - (y * res) - res,
                            3857
                    );
                if srid = 3857 then
                    return bbox;
                else
                    return ST_Transform(bbox, srid);
                end if;
            end;
            ${'$'}${'$'};
            
            CREATE TABLE acceptingstores (
                                                             id integer NOT NULL,
                                                             name character varying(150) NOT NULL,
                                                             description character varying(2500),
                                                             "contactId" integer NOT NULL,
                                                             "categoryId" integer NOT NULL,
                                                             "projectId" integer NOT NULL,
                                                             "regionId" integer
            );
            CREATE SEQUENCE acceptingstores_id_seq
                AS integer
                START WITH 1
                INCREMENT BY 1
                NO MINVALUE
                NO MAXVALUE
                CACHE 1;
            ALTER SEQUENCE acceptingstores_id_seq OWNED BY acceptingstores.id;
            
            CREATE TABLE addresses (
                                                       id integer NOT NULL,
                                                       street character varying(200),
                                                       "postalCode" character varying(10) NOT NULL,
                                                       location character varying(200) NOT NULL,
                                                       "countryCode" character varying(2) NOT NULL
            );
            CREATE SEQUENCE addresses_id_seq
                AS integer
                START WITH 1
                INCREMENT BY 1
                NO MINVALUE
                NO MAXVALUE
                CACHE 1;
            
            ALTER SEQUENCE addresses_id_seq OWNED BY addresses.id;
            
            CREATE TABLE administrators (
                                                            id integer NOT NULL,
                                                            email character varying(100) NOT NULL,
                                                            "projectId" integer NOT NULL,
                                                            "regionId" integer,
                                                            role character varying(32) NOT NULL,
                                                            "passwordHash" bytea,
                                                            "passwordResetKey" character varying(100),
                                                            "passwordResetKeyExpiry" timestamp without time zone,
                                                            deleted boolean NOT NULL,
                                                            CONSTRAINT deletedifandonlyifnorights CHECK ((((deleted = true) AND ((role)::text = 'NO_RIGHTS'::text)) OR ((deleted = false) AND ((role)::text <> 'NO_RIGHTS'::text)))),
                                                            CONSTRAINT roleregioncombinationconstraint CHECK (((("regionId" IS NULL) AND ((role)::text = ANY ((ARRAY['PROJECT_ADMIN'::character varying, 'NO_RIGHTS'::character varying])::text[]))) OR (("regionId" IS NOT NULL) AND ((role)::text = ANY ((ARRAY['REGION_MANAGER'::character varying, 'REGION_ADMIN'::character varying, 'NO_RIGHTS'::character varying])::text[])))))
            );
            
            CREATE SEQUENCE administrators_id_seq
                AS integer
                START WITH 1
                INCREMENT BY 1
                NO MINVALUE
                NO MAXVALUE
                CACHE 1;
            
            ALTER SEQUENCE administrators_id_seq OWNED BY administrators.id;
            
            CREATE TABLE applications (
                                                          id integer NOT NULL,
                                                          "regionId" integer NOT NULL,
                                                          "jsonValue" text NOT NULL,
                                                          "createdDate" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
                                                          "accessKey" character varying(100) NOT NULL,
                                                          "withdrawalDate" timestamp without time zone
            );
            
            CREATE SEQUENCE applications_id_seq
                AS integer
                START WITH 1
                INCREMENT BY 1
                NO MINVALUE
                NO MAXVALUE
                CACHE 1;
            
            ALTER SEQUENCE applications_id_seq OWNED BY applications.id;
            
            CREATE TABLE applicationverifications (
                                                                      id integer NOT NULL,
                                                                      "applicationId" integer NOT NULL,
                                                                      "contactEmailAddress" character varying(300) NOT NULL,
                                                                      "contactName" character varying(300) NOT NULL,
                                                                      "organizationName" character varying(300) NOT NULL,
                                                                      "verifiedDate" timestamp without time zone,
                                                                      "rejectedDate" timestamp without time zone,
                                                                      "accessKey" character varying(100) NOT NULL,
                                                                      CONSTRAINT notverifiedandrejected CHECK ((NOT (("verifiedDate" IS NOT NULL) AND ("rejectedDate" IS NOT NULL))))
            );
            
            CREATE SEQUENCE applicationverifications_id_seq
                AS integer
                START WITH 1
                INCREMENT BY 1
                NO MINVALUE
                NO MAXVALUE
                CACHE 1;
            
            ALTER SEQUENCE applicationverifications_id_seq OWNED BY applicationverifications.id;
            
            CREATE TABLE cards (
                                                   id integer NOT NULL,
                                                   "activationSecretHash" bytea,
                                                   "totpSecret" bytea,
                                                   "expirationDay" bigint,
                                                   "issueDate" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
                                                   revoked boolean NOT NULL,
                                                   "regionId" integer NOT NULL,
                                                   "issuerId" integer NOT NULL,
                                                   "cardInfoHash" bytea NOT NULL,
                                                   "codeType" integer NOT NULL,
                                                   CONSTRAINT codetypeconstraint CHECK (((("activationSecretHash" IS NULL) AND ("totpSecret" IS NULL) AND ("codeType" = 0)) OR (("activationSecretHash" IS NOT NULL) AND ("codeType" = 1))))
            );
            
            CREATE SEQUENCE cards_id_seq
                AS integer
                START WITH 1
                INCREMENT BY 1
                NO MINVALUE
                NO MAXVALUE
                CACHE 1;
            
            ALTER SEQUENCE cards_id_seq OWNED BY cards.id;
            
            CREATE TABLE categories (
                                                        id integer NOT NULL,
                                                        name character varying(50) NOT NULL
            );
            
            CREATE SEQUENCE categories_id_seq
                AS integer
                START WITH 1
                INCREMENT BY 1
                NO MINVALUE
                NO MAXVALUE
                CACHE 1;
            
            ALTER SEQUENCE categories_id_seq OWNED BY categories.id;
            
            CREATE TABLE contacts (
                                                      id integer NOT NULL,
                                                      email character varying(100),
                                                      telephone character varying(100),
                                                      website character varying(200)
            );
            
            CREATE SEQUENCE contacts_id_seq
                AS integer
                START WITH 1
                INCREMENT BY 1
                NO MINVALUE
                NO MAXVALUE
                CACHE 1;
            
            ALTER SEQUENCE contacts_id_seq OWNED BY contacts.id;
            
            CREATE TABLE physicalstores (
                                                            id integer NOT NULL,
                                                            coordinates geometry(Point,4326) NOT NULL,
                                                            "addressId" integer NOT NULL,
                                                            "storeId" integer NOT NULL
            );
            
            CREATE SEQUENCE physicalstores_id_seq
                AS integer
                START WITH 1
                INCREMENT BY 1
                NO MINVALUE
                NO MAXVALUE
                CACHE 1;
            
            ALTER SEQUENCE physicalstores_id_seq OWNED BY physicalstores.id;
            
            CREATE TABLE projects (
                                                      id integer NOT NULL,
                                                      project character varying(50) NOT NULL
            );
            
            CREATE SEQUENCE projects_id_seq
                AS integer
                START WITH 1
                INCREMENT BY 1
                NO MINVALUE
                NO MAXVALUE
                CACHE 1;
            
            ALTER SEQUENCE projects_id_seq OWNED BY projects.id;
            
            CREATE TABLE regions (
                                                     id integer NOT NULL,
                                                     "projectId" integer NOT NULL,
                                                     "regionIdentifier" character(5),
                                                     website character varying(400) NOT NULL,
                                                     name character varying(100) NOT NULL,
                                                     prefix character varying(30) NOT NULL,
                                                     "dataPrivacyPolicy" character varying(20000)
            );
            
            CREATE SEQUENCE regions_id_seq
                AS integer
                START WITH 1
                INCREMENT BY 1
                NO MINVALUE
                NO MAXVALUE
                CACHE 1;
            
            ALTER SEQUENCE regions_id_seq OWNED BY regions.id;
            
            ALTER TABLE ONLY acceptingstores ALTER COLUMN id SET DEFAULT nextval('acceptingstores_id_seq'::regclass);
            
            ALTER TABLE ONLY addresses ALTER COLUMN id SET DEFAULT nextval('addresses_id_seq'::regclass);
            
            ALTER TABLE ONLY administrators ALTER COLUMN id SET DEFAULT nextval('administrators_id_seq'::regclass);
            
            ALTER TABLE ONLY applications ALTER COLUMN id SET DEFAULT nextval('applications_id_seq'::regclass);
            
            ALTER TABLE ONLY applicationverifications ALTER COLUMN id SET DEFAULT nextval('applicationverifications_id_seq'::regclass);
            
            ALTER TABLE ONLY cards ALTER COLUMN id SET DEFAULT nextval('cards_id_seq'::regclass);
            
            ALTER TABLE ONLY categories ALTER COLUMN id SET DEFAULT nextval('categories_id_seq'::regclass);
            
            ALTER TABLE ONLY contacts ALTER COLUMN id SET DEFAULT nextval('contacts_id_seq'::regclass);
            
            ALTER TABLE ONLY physicalstores ALTER COLUMN id SET DEFAULT nextval('physicalstores_id_seq'::regclass);
            
            ALTER TABLE ONLY projects ALTER COLUMN id SET DEFAULT nextval('projects_id_seq'::regclass);
            
            ALTER TABLE ONLY regions ALTER COLUMN id SET DEFAULT nextval('regions_id_seq'::regclass);
            
            ALTER TABLE ONLY acceptingstores
                ADD CONSTRAINT acceptingstores_pkey PRIMARY KEY (id);
            
            ALTER TABLE ONLY addresses
                ADD CONSTRAINT addresses_pkey PRIMARY KEY (id);
            
            ALTER TABLE ONLY administrators
                ADD CONSTRAINT administrators_email_unique UNIQUE (email);
            
            ALTER TABLE ONLY administrators
                ADD CONSTRAINT administrators_pkey PRIMARY KEY (id);
            
            ALTER TABLE ONLY applications
                ADD CONSTRAINT applications_accesskey_unique UNIQUE ("accessKey");
            
            ALTER TABLE ONLY applications
                ADD CONSTRAINT applications_pkey PRIMARY KEY (id);
            
            ALTER TABLE ONLY applicationverifications
                ADD CONSTRAINT applicationverifications_accesskey_unique UNIQUE ("accessKey");
            
            ALTER TABLE ONLY applicationverifications
                ADD CONSTRAINT applicationverifications_pkey PRIMARY KEY (id);
            
            ALTER TABLE ONLY cards
                ADD CONSTRAINT cards_cardinfohash_unique UNIQUE ("cardInfoHash");
            
            ALTER TABLE ONLY cards
                ADD CONSTRAINT cards_pkey PRIMARY KEY (id);
            
            ALTER TABLE ONLY categories
                ADD CONSTRAINT categories_pkey PRIMARY KEY (id);
            
            ALTER TABLE ONLY contacts
                ADD CONSTRAINT contacts_pkey PRIMARY KEY (id);
            
            ALTER TABLE ONLY physicalstores
                ADD CONSTRAINT physicalstores_pkey PRIMARY KEY (id);
            
            ALTER TABLE ONLY projects
                ADD CONSTRAINT projects_pkey PRIMARY KEY (id);
            
            ALTER TABLE ONLY projects
                ADD CONSTRAINT projects_project_unique UNIQUE (project);
            
            ALTER TABLE ONLY regions
                ADD CONSTRAINT regions_pkey PRIMARY KEY (id);
            
            ALTER TABLE ONLY regions
                ADD CONSTRAINT regions_regionidentifier_unique UNIQUE ("regionIdentifier");
            
            CREATE UNIQUE INDEX email_lower_idx ON administrators USING btree (lower((email)::text));
            
            ALTER TABLE ONLY acceptingstores
                ADD CONSTRAINT fk_acceptingstores_categoryid__id FOREIGN KEY ("categoryId") REFERENCES categories(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
            
            ALTER TABLE ONLY acceptingstores
                ADD CONSTRAINT fk_acceptingstores_contactid__id FOREIGN KEY ("contactId") REFERENCES contacts(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
            
            ALTER TABLE ONLY acceptingstores
                ADD CONSTRAINT fk_acceptingstores_projectid__id FOREIGN KEY ("projectId") REFERENCES projects(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
            
            ALTER TABLE ONLY acceptingstores
                ADD CONSTRAINT fk_acceptingstores_regionid__id FOREIGN KEY ("regionId") REFERENCES regions(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
            
            ALTER TABLE ONLY administrators
                ADD CONSTRAINT fk_administrators_projectid__id FOREIGN KEY ("projectId") REFERENCES projects(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
            
            ALTER TABLE ONLY administrators
                ADD CONSTRAINT fk_administrators_regionid__id FOREIGN KEY ("regionId") REFERENCES regions(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
            
            ALTER TABLE ONLY applications
                ADD CONSTRAINT fk_applications_regionid__id FOREIGN KEY ("regionId") REFERENCES regions(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
            
            ALTER TABLE ONLY applicationverifications
                ADD CONSTRAINT fk_applicationverifications_applicationid__id FOREIGN KEY ("applicationId") REFERENCES applications(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
            
            ALTER TABLE ONLY cards
                ADD CONSTRAINT fk_cards_issuerid__id FOREIGN KEY ("issuerId") REFERENCES administrators(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
            
            ALTER TABLE ONLY cards
                ADD CONSTRAINT fk_cards_regionid__id FOREIGN KEY ("regionId") REFERENCES regions(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
            
            ALTER TABLE ONLY physicalstores
                ADD CONSTRAINT fk_physicalstores_addressid__id FOREIGN KEY ("addressId") REFERENCES addresses(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
            
            ALTER TABLE ONLY physicalstores
                ADD CONSTRAINT fk_physicalstores_storeid__id FOREIGN KEY ("storeId") REFERENCES acceptingstores(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
            
            ALTER TABLE ONLY regions
                ADD CONSTRAINT fk_regions_projectid__id FOREIGN KEY ("projectId") REFERENCES projects(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
            """.trimIndent(),
        )
    }
}
