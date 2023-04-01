--
-- PostgreSQL database dump
--

-- Dumped from database version 13.9 (Debian 13.9-0+deb11u1)
-- Dumped by pg_dump version 13.9 (Debian 13.9-0+deb11u1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: entitlementcard; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA entitlementcard;


ALTER SCHEMA entitlementcard OWNER TO postgres;

--
-- Name: postgis; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA entitlementcard;


--
-- Name: EXTENSION postgis; Type: COMMENT; Schema: -; Owner:
--

COMMENT ON EXTENSION postgis IS 'PostGIS geometry and geography spatial types and functions';


--
-- Name: physical_stores(integer, integer, integer, json); Type: FUNCTION; Schema: entitlementcard; Owner: backend
--

CREATE FUNCTION entitlementcard.physical_stores(z integer, x integer, y integer, query_params json) RETURNS bytea
    LANGUAGE plpgsql IMMUTABLE STRICT PARALLEL SAFE
AS $$
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
$$;


ALTER FUNCTION entitlementcard.physical_stores(z integer, x integer, y integer, query_params json) OWNER TO backend;

--
-- Name: physical_stores_clustered(integer, integer, integer, json); Type: FUNCTION; Schema: entitlementcard; Owner: backend
--

CREATE FUNCTION entitlementcard.physical_stores_clustered(z integer, x integer, y integer, query_params json) RETURNS bytea
    LANGUAGE plpgsql IMMUTABLE STRICT PARALLEL SAFE
AS $$
DECLARE
    -- DEPRECATED: Fallback only used in old ehrenamtskarten app, released January, 2021
    project_id text = CASE WHEN query_params::jsonb ? 'project_id' THEN (query_params->>'project_id')::text ELSE 'bayern.ehrenamtskarte.app' END;
BEGIN
    RETURN physical_stores_clusters(z, x, y, project_id);
END
$$;


ALTER FUNCTION entitlementcard.physical_stores_clustered(z integer, x integer, y integer, query_params json) OWNER TO backend;

--
-- Name: physical_stores_clusters(integer, integer, integer, text); Type: FUNCTION; Schema: entitlementcard; Owner: backend
--

CREATE FUNCTION entitlementcard.physical_stores_clusters(z integer, x integer, y integer, project_id text) RETURNS bytea
    LANGUAGE plpgsql IMMUTABLE STRICT PARALLEL SAFE
AS $$
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
$$;


ALTER FUNCTION entitlementcard.physical_stores_clusters(z integer, x integer, y integer, project_id text) OWNER TO backend;

--
-- Name: physical_stores_points(integer, integer, integer, text); Type: FUNCTION; Schema: entitlementcard; Owner: backend
--

CREATE FUNCTION entitlementcard.physical_stores_points(z integer, x integer, y integer, project_id text) RETURNS bytea
    LANGUAGE plpgsql IMMUTABLE STRICT PARALLEL SAFE
AS $$
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
$$;


ALTER FUNCTION entitlementcard.physical_stores_points(z integer, x integer, y integer, project_id text) OWNER TO backend;

--
-- Name: tilebbox(integer, integer, integer, integer); Type: FUNCTION; Schema: entitlementcard; Owner: backend
--

CREATE FUNCTION entitlementcard.tilebbox(z integer, x integer, y integer, srid integer DEFAULT 3857) RETURNS entitlementcard.geometry
    LANGUAGE plpgsql IMMUTABLE
AS $$
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
$$;


ALTER FUNCTION entitlementcard.tilebbox(z integer, x integer, y integer, srid integer) OWNER TO backend;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: acceptingstores; Type: TABLE; Schema: entitlementcard; Owner: backend
--

CREATE TABLE entitlementcard.acceptingstores (
                                                 id integer NOT NULL,
                                                 name character varying(150) NOT NULL,
                                                 description character varying(2500),
                                                 "contactId" integer NOT NULL,
                                                 "categoryId" integer NOT NULL,
                                                 "projectId" integer NOT NULL,
                                                 "regionId" integer
);


ALTER TABLE entitlementcard.acceptingstores OWNER TO backend;

--
-- Name: acceptingstores_id_seq; Type: SEQUENCE; Schema: entitlementcard; Owner: backend
--

CREATE SEQUENCE entitlementcard.acceptingstores_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE entitlementcard.acceptingstores_id_seq OWNER TO backend;

--
-- Name: acceptingstores_id_seq; Type: SEQUENCE OWNED BY; Schema: entitlementcard; Owner: backend
--

ALTER SEQUENCE entitlementcard.acceptingstores_id_seq OWNED BY entitlementcard.acceptingstores.id;


--
-- Name: addresses; Type: TABLE; Schema: entitlementcard; Owner: backend
--

CREATE TABLE entitlementcard.addresses (
                                           id integer NOT NULL,
                                           street character varying(200),
                                           "postalCode" character varying(10) NOT NULL,
                                           location character varying(200) NOT NULL,
                                           "countryCode" character varying(2) NOT NULL
);


ALTER TABLE entitlementcard.addresses OWNER TO backend;

--
-- Name: addresses_id_seq; Type: SEQUENCE; Schema: entitlementcard; Owner: backend
--

CREATE SEQUENCE entitlementcard.addresses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE entitlementcard.addresses_id_seq OWNER TO backend;

--
-- Name: addresses_id_seq; Type: SEQUENCE OWNED BY; Schema: entitlementcard; Owner: backend
--

ALTER SEQUENCE entitlementcard.addresses_id_seq OWNED BY entitlementcard.addresses.id;


--
-- Name: administrators; Type: TABLE; Schema: entitlementcard; Owner: backend
--

CREATE TABLE entitlementcard.administrators (
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


ALTER TABLE entitlementcard.administrators OWNER TO backend;

--
-- Name: administrators_id_seq; Type: SEQUENCE; Schema: entitlementcard; Owner: backend
--

CREATE SEQUENCE entitlementcard.administrators_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE entitlementcard.administrators_id_seq OWNER TO backend;

--
-- Name: administrators_id_seq; Type: SEQUENCE OWNED BY; Schema: entitlementcard; Owner: backend
--

ALTER SEQUENCE entitlementcard.administrators_id_seq OWNED BY entitlementcard.administrators.id;


--
-- Name: applications; Type: TABLE; Schema: entitlementcard; Owner: backend
--

CREATE TABLE entitlementcard.applications (
                                              id integer NOT NULL,
                                              "regionId" integer NOT NULL,
                                              "jsonValue" text NOT NULL,
                                              "createdDate" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
                                              "accessKey" character varying(100) NOT NULL,
                                              "withdrawalDate" timestamp without time zone
);


ALTER TABLE entitlementcard.applications OWNER TO backend;

--
-- Name: applications_id_seq; Type: SEQUENCE; Schema: entitlementcard; Owner: backend
--

CREATE SEQUENCE entitlementcard.applications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE entitlementcard.applications_id_seq OWNER TO backend;

--
-- Name: applications_id_seq; Type: SEQUENCE OWNED BY; Schema: entitlementcard; Owner: backend
--

ALTER SEQUENCE entitlementcard.applications_id_seq OWNED BY entitlementcard.applications.id;


--
-- Name: applicationverifications; Type: TABLE; Schema: entitlementcard; Owner: backend
--

CREATE TABLE entitlementcard.applicationverifications (
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


ALTER TABLE entitlementcard.applicationverifications OWNER TO backend;

--
-- Name: applicationverifications_id_seq; Type: SEQUENCE; Schema: entitlementcard; Owner: backend
--

CREATE SEQUENCE entitlementcard.applicationverifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE entitlementcard.applicationverifications_id_seq OWNER TO backend;

--
-- Name: applicationverifications_id_seq; Type: SEQUENCE OWNED BY; Schema: entitlementcard; Owner: backend
--

ALTER SEQUENCE entitlementcard.applicationverifications_id_seq OWNED BY entitlementcard.applicationverifications.id;


--
-- Name: cards; Type: TABLE; Schema: entitlementcard; Owner: backend
--

CREATE TABLE entitlementcard.cards (
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


ALTER TABLE entitlementcard.cards OWNER TO backend;

--
-- Name: cards_id_seq; Type: SEQUENCE; Schema: entitlementcard; Owner: backend
--

CREATE SEQUENCE entitlementcard.cards_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE entitlementcard.cards_id_seq OWNER TO backend;

--
-- Name: cards_id_seq; Type: SEQUENCE OWNED BY; Schema: entitlementcard; Owner: backend
--

ALTER SEQUENCE entitlementcard.cards_id_seq OWNED BY entitlementcard.cards.id;


--
-- Name: categories; Type: TABLE; Schema: entitlementcard; Owner: backend
--

CREATE TABLE entitlementcard.categories (
                                            id integer NOT NULL,
                                            name character varying(50) NOT NULL
);


ALTER TABLE entitlementcard.categories OWNER TO backend;

--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: entitlementcard; Owner: backend
--

CREATE SEQUENCE entitlementcard.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE entitlementcard.categories_id_seq OWNER TO backend;

--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: entitlementcard; Owner: backend
--

ALTER SEQUENCE entitlementcard.categories_id_seq OWNED BY entitlementcard.categories.id;


--
-- Name: contacts; Type: TABLE; Schema: entitlementcard; Owner: backend
--

CREATE TABLE entitlementcard.contacts (
                                          id integer NOT NULL,
                                          email character varying(100),
                                          telephone character varying(100),
                                          website character varying(200)
);


ALTER TABLE entitlementcard.contacts OWNER TO backend;

--
-- Name: contacts_id_seq; Type: SEQUENCE; Schema: entitlementcard; Owner: backend
--

CREATE SEQUENCE entitlementcard.contacts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE entitlementcard.contacts_id_seq OWNER TO backend;

--
-- Name: contacts_id_seq; Type: SEQUENCE OWNED BY; Schema: entitlementcard; Owner: backend
--

ALTER SEQUENCE entitlementcard.contacts_id_seq OWNED BY entitlementcard.contacts.id;


--
-- Name: physicalstores; Type: TABLE; Schema: entitlementcard; Owner: backend
--

CREATE TABLE entitlementcard.physicalstores (
                                                id integer NOT NULL,
                                                coordinates entitlementcard.geometry(Point,4326) NOT NULL,
                                                "addressId" integer NOT NULL,
                                                "storeId" integer NOT NULL
);


ALTER TABLE entitlementcard.physicalstores OWNER TO backend;

--
-- Name: physicalstores_id_seq; Type: SEQUENCE; Schema: entitlementcard; Owner: backend
--

CREATE SEQUENCE entitlementcard.physicalstores_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE entitlementcard.physicalstores_id_seq OWNER TO backend;

--
-- Name: physicalstores_id_seq; Type: SEQUENCE OWNED BY; Schema: entitlementcard; Owner: backend
--

ALTER SEQUENCE entitlementcard.physicalstores_id_seq OWNED BY entitlementcard.physicalstores.id;


--
-- Name: projects; Type: TABLE; Schema: entitlementcard; Owner: backend
--

CREATE TABLE entitlementcard.projects (
                                          id integer NOT NULL,
                                          project character varying(50) NOT NULL
);


ALTER TABLE entitlementcard.projects OWNER TO backend;

--
-- Name: projects_id_seq; Type: SEQUENCE; Schema: entitlementcard; Owner: backend
--

CREATE SEQUENCE entitlementcard.projects_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE entitlementcard.projects_id_seq OWNER TO backend;

--
-- Name: projects_id_seq; Type: SEQUENCE OWNED BY; Schema: entitlementcard; Owner: backend
--

ALTER SEQUENCE entitlementcard.projects_id_seq OWNED BY entitlementcard.projects.id;


--
-- Name: regions; Type: TABLE; Schema: entitlementcard; Owner: backend
--

CREATE TABLE entitlementcard.regions (
                                         id integer NOT NULL,
                                         "projectId" integer NOT NULL,
                                         "regionIdentifier" character(5),
                                         website character varying(400) NOT NULL,
                                         name character varying(100) NOT NULL,
                                         prefix character varying(30) NOT NULL,
                                         "dataPrivacyPolicy" character varying(20000)
);


ALTER TABLE entitlementcard.regions OWNER TO backend;

--
-- Name: regions_id_seq; Type: SEQUENCE; Schema: entitlementcard; Owner: backend
--

CREATE SEQUENCE entitlementcard.regions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE entitlementcard.regions_id_seq OWNER TO backend;

--
-- Name: regions_id_seq; Type: SEQUENCE OWNED BY; Schema: entitlementcard; Owner: backend
--

ALTER SEQUENCE entitlementcard.regions_id_seq OWNED BY entitlementcard.regions.id;


--
-- Name: acceptingstores id; Type: DEFAULT; Schema: entitlementcard; Owner: backend
--

ALTER TABLE ONLY entitlementcard.acceptingstores ALTER COLUMN id SET DEFAULT nextval('entitlementcard.acceptingstores_id_seq'::regclass);


--
-- Name: addresses id; Type: DEFAULT; Schema: entitlementcard; Owner: backend
--

ALTER TABLE ONLY entitlementcard.addresses ALTER COLUMN id SET DEFAULT nextval('entitlementcard.addresses_id_seq'::regclass);


--
-- Name: administrators id; Type: DEFAULT; Schema: entitlementcard; Owner: backend
--

ALTER TABLE ONLY entitlementcard.administrators ALTER COLUMN id SET DEFAULT nextval('entitlementcard.administrators_id_seq'::regclass);


--
-- Name: applications id; Type: DEFAULT; Schema: entitlementcard; Owner: backend
--

ALTER TABLE ONLY entitlementcard.applications ALTER COLUMN id SET DEFAULT nextval('entitlementcard.applications_id_seq'::regclass);


--
-- Name: applicationverifications id; Type: DEFAULT; Schema: entitlementcard; Owner: backend
--

ALTER TABLE ONLY entitlementcard.applicationverifications ALTER COLUMN id SET DEFAULT nextval('entitlementcard.applicationverifications_id_seq'::regclass);


--
-- Name: cards id; Type: DEFAULT; Schema: entitlementcard; Owner: backend
--

ALTER TABLE ONLY entitlementcard.cards ALTER COLUMN id SET DEFAULT nextval('entitlementcard.cards_id_seq'::regclass);


--
-- Name: categories id; Type: DEFAULT; Schema: entitlementcard; Owner: backend
--

ALTER TABLE ONLY entitlementcard.categories ALTER COLUMN id SET DEFAULT nextval('entitlementcard.categories_id_seq'::regclass);


--
-- Name: contacts id; Type: DEFAULT; Schema: entitlementcard; Owner: backend
--

ALTER TABLE ONLY entitlementcard.contacts ALTER COLUMN id SET DEFAULT nextval('entitlementcard.contacts_id_seq'::regclass);


--
-- Name: physicalstores id; Type: DEFAULT; Schema: entitlementcard; Owner: backend
--

ALTER TABLE ONLY entitlementcard.physicalstores ALTER COLUMN id SET DEFAULT nextval('entitlementcard.physicalstores_id_seq'::regclass);


--
-- Name: projects id; Type: DEFAULT; Schema: entitlementcard; Owner: backend
--

ALTER TABLE ONLY entitlementcard.projects ALTER COLUMN id SET DEFAULT nextval('entitlementcard.projects_id_seq'::regclass);


--
-- Name: regions id; Type: DEFAULT; Schema: entitlementcard; Owner: backend
--

ALTER TABLE ONLY entitlementcard.regions ALTER COLUMN id SET DEFAULT nextval('entitlementcard.regions_id_seq'::regclass);


--
-- Name: acceptingstores acceptingstores_pkey; Type: CONSTRAINT; Schema: entitlementcard; Owner: backend
--

ALTER TABLE ONLY entitlementcard.acceptingstores
    ADD CONSTRAINT acceptingstores_pkey PRIMARY KEY (id);


--
-- Name: addresses addresses_pkey; Type: CONSTRAINT; Schema: entitlementcard; Owner: backend
--

ALTER TABLE ONLY entitlementcard.addresses
    ADD CONSTRAINT addresses_pkey PRIMARY KEY (id);


--
-- Name: administrators administrators_email_unique; Type: CONSTRAINT; Schema: entitlementcard; Owner: backend
--

ALTER TABLE ONLY entitlementcard.administrators
    ADD CONSTRAINT administrators_email_unique UNIQUE (email);


--
-- Name: administrators administrators_pkey; Type: CONSTRAINT; Schema: entitlementcard; Owner: backend
--

ALTER TABLE ONLY entitlementcard.administrators
    ADD CONSTRAINT administrators_pkey PRIMARY KEY (id);


--
-- Name: applications applications_accesskey_unique; Type: CONSTRAINT; Schema: entitlementcard; Owner: backend
--

ALTER TABLE ONLY entitlementcard.applications
    ADD CONSTRAINT applications_accesskey_unique UNIQUE ("accessKey");


--
-- Name: applications applications_pkey; Type: CONSTRAINT; Schema: entitlementcard; Owner: backend
--

ALTER TABLE ONLY entitlementcard.applications
    ADD CONSTRAINT applications_pkey PRIMARY KEY (id);


--
-- Name: applicationverifications applicationverifications_accesskey_unique; Type: CONSTRAINT; Schema: entitlementcard; Owner: backend
--

ALTER TABLE ONLY entitlementcard.applicationverifications
    ADD CONSTRAINT applicationverifications_accesskey_unique UNIQUE ("accessKey");


--
-- Name: applicationverifications applicationverifications_pkey; Type: CONSTRAINT; Schema: entitlementcard; Owner: backend
--

ALTER TABLE ONLY entitlementcard.applicationverifications
    ADD CONSTRAINT applicationverifications_pkey PRIMARY KEY (id);


--
-- Name: cards cards_cardinfohash_unique; Type: CONSTRAINT; Schema: entitlementcard; Owner: backend
--

ALTER TABLE ONLY entitlementcard.cards
    ADD CONSTRAINT cards_cardinfohash_unique UNIQUE ("cardInfoHash");


--
-- Name: cards cards_pkey; Type: CONSTRAINT; Schema: entitlementcard; Owner: backend
--

ALTER TABLE ONLY entitlementcard.cards
    ADD CONSTRAINT cards_pkey PRIMARY KEY (id);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: entitlementcard; Owner: backend
--

ALTER TABLE ONLY entitlementcard.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: contacts contacts_pkey; Type: CONSTRAINT; Schema: entitlementcard; Owner: backend
--

ALTER TABLE ONLY entitlementcard.contacts
    ADD CONSTRAINT contacts_pkey PRIMARY KEY (id);


--
-- Name: physicalstores physicalstores_pkey; Type: CONSTRAINT; Schema: entitlementcard; Owner: backend
--

ALTER TABLE ONLY entitlementcard.physicalstores
    ADD CONSTRAINT physicalstores_pkey PRIMARY KEY (id);


--
-- Name: projects projects_pkey; Type: CONSTRAINT; Schema: entitlementcard; Owner: backend
--

ALTER TABLE ONLY entitlementcard.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (id);


--
-- Name: projects projects_project_unique; Type: CONSTRAINT; Schema: entitlementcard; Owner: backend
--

ALTER TABLE ONLY entitlementcard.projects
    ADD CONSTRAINT projects_project_unique UNIQUE (project);


--
-- Name: regions regions_pkey; Type: CONSTRAINT; Schema: entitlementcard; Owner: backend
--

ALTER TABLE ONLY entitlementcard.regions
    ADD CONSTRAINT regions_pkey PRIMARY KEY (id);


--
-- Name: regions regions_regionidentifier_unique; Type: CONSTRAINT; Schema: entitlementcard; Owner: backend
--

ALTER TABLE ONLY entitlementcard.regions
    ADD CONSTRAINT regions_regionidentifier_unique UNIQUE ("regionIdentifier");


--
-- Name: email_lower_idx; Type: INDEX; Schema: entitlementcard; Owner: backend
--

CREATE UNIQUE INDEX email_lower_idx ON entitlementcard.administrators USING btree (lower((email)::text));


--
-- Name: acceptingstores fk_acceptingstores_categoryid__id; Type: FK CONSTRAINT; Schema: entitlementcard; Owner: backend
--

ALTER TABLE ONLY entitlementcard.acceptingstores
    ADD CONSTRAINT fk_acceptingstores_categoryid__id FOREIGN KEY ("categoryId") REFERENCES entitlementcard.categories(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: acceptingstores fk_acceptingstores_contactid__id; Type: FK CONSTRAINT; Schema: entitlementcard; Owner: backend
--

ALTER TABLE ONLY entitlementcard.acceptingstores
    ADD CONSTRAINT fk_acceptingstores_contactid__id FOREIGN KEY ("contactId") REFERENCES entitlementcard.contacts(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: acceptingstores fk_acceptingstores_projectid__id; Type: FK CONSTRAINT; Schema: entitlementcard; Owner: backend
--

ALTER TABLE ONLY entitlementcard.acceptingstores
    ADD CONSTRAINT fk_acceptingstores_projectid__id FOREIGN KEY ("projectId") REFERENCES entitlementcard.projects(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: acceptingstores fk_acceptingstores_regionid__id; Type: FK CONSTRAINT; Schema: entitlementcard; Owner: backend
--

ALTER TABLE ONLY entitlementcard.acceptingstores
    ADD CONSTRAINT fk_acceptingstores_regionid__id FOREIGN KEY ("regionId") REFERENCES entitlementcard.regions(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: administrators fk_administrators_projectid__id; Type: FK CONSTRAINT; Schema: entitlementcard; Owner: backend
--

ALTER TABLE ONLY entitlementcard.administrators
    ADD CONSTRAINT fk_administrators_projectid__id FOREIGN KEY ("projectId") REFERENCES entitlementcard.projects(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: administrators fk_administrators_regionid__id; Type: FK CONSTRAINT; Schema: entitlementcard; Owner: backend
--

ALTER TABLE ONLY entitlementcard.administrators
    ADD CONSTRAINT fk_administrators_regionid__id FOREIGN KEY ("regionId") REFERENCES entitlementcard.regions(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: applications fk_applications_regionid__id; Type: FK CONSTRAINT; Schema: entitlementcard; Owner: backend
--

ALTER TABLE ONLY entitlementcard.applications
    ADD CONSTRAINT fk_applications_regionid__id FOREIGN KEY ("regionId") REFERENCES entitlementcard.regions(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: applicationverifications fk_applicationverifications_applicationid__id; Type: FK CONSTRAINT; Schema: entitlementcard; Owner: backend
--

ALTER TABLE ONLY entitlementcard.applicationverifications
    ADD CONSTRAINT fk_applicationverifications_applicationid__id FOREIGN KEY ("applicationId") REFERENCES entitlementcard.applications(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: cards fk_cards_issuerid__id; Type: FK CONSTRAINT; Schema: entitlementcard; Owner: backend
--

ALTER TABLE ONLY entitlementcard.cards
    ADD CONSTRAINT fk_cards_issuerid__id FOREIGN KEY ("issuerId") REFERENCES entitlementcard.administrators(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: cards fk_cards_regionid__id; Type: FK CONSTRAINT; Schema: entitlementcard; Owner: backend
--

ALTER TABLE ONLY entitlementcard.cards
    ADD CONSTRAINT fk_cards_regionid__id FOREIGN KEY ("regionId") REFERENCES entitlementcard.regions(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: physicalstores fk_physicalstores_addressid__id; Type: FK CONSTRAINT; Schema: entitlementcard; Owner: backend
--

ALTER TABLE ONLY entitlementcard.physicalstores
    ADD CONSTRAINT fk_physicalstores_addressid__id FOREIGN KEY ("addressId") REFERENCES entitlementcard.addresses(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: physicalstores fk_physicalstores_storeid__id; Type: FK CONSTRAINT; Schema: entitlementcard; Owner: backend
--

ALTER TABLE ONLY entitlementcard.physicalstores
    ADD CONSTRAINT fk_physicalstores_storeid__id FOREIGN KEY ("storeId") REFERENCES entitlementcard.acceptingstores(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: regions fk_regions_projectid__id; Type: FK CONSTRAINT; Schema: entitlementcard; Owner: backend
--

ALTER TABLE ONLY entitlementcard.regions
    ADD CONSTRAINT fk_regions_projectid__id FOREIGN KEY ("projectId") REFERENCES entitlementcard.projects(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: SCHEMA entitlementcard; Type: ACL; Schema: -; Owner: postgres
--

GRANT ALL ON SCHEMA entitlementcard TO backend;
GRANT USAGE ON SCHEMA entitlementcard TO martin;


--
-- Name: TABLE acceptingstores; Type: ACL; Schema: entitlementcard; Owner: backend
--

GRANT SELECT ON TABLE entitlementcard.acceptingstores TO martin;


--
-- Name: TABLE addresses; Type: ACL; Schema: entitlementcard; Owner: backend
--

GRANT SELECT ON TABLE entitlementcard.addresses TO martin;


--
-- Name: TABLE administrators; Type: ACL; Schema: entitlementcard; Owner: backend
--

GRANT SELECT ON TABLE entitlementcard.administrators TO martin;


--
-- Name: TABLE applications; Type: ACL; Schema: entitlementcard; Owner: backend
--

GRANT SELECT ON TABLE entitlementcard.applications TO martin;


--
-- Name: TABLE applicationverifications; Type: ACL; Schema: entitlementcard; Owner: backend
--

GRANT SELECT ON TABLE entitlementcard.applicationverifications TO martin;


--
-- Name: TABLE cards; Type: ACL; Schema: entitlementcard; Owner: backend
--

GRANT SELECT ON TABLE entitlementcard.cards TO martin;


--
-- Name: TABLE categories; Type: ACL; Schema: entitlementcard; Owner: backend
--

GRANT SELECT ON TABLE entitlementcard.categories TO martin;


--
-- Name: TABLE contacts; Type: ACL; Schema: entitlementcard; Owner: backend
--

GRANT SELECT ON TABLE entitlementcard.contacts TO martin;


--
-- Name: TABLE geography_columns; Type: ACL; Schema: entitlementcard; Owner: postgres
--

GRANT ALL ON TABLE entitlementcard.geography_columns TO backend;


--
-- Name: TABLE geometry_columns; Type: ACL; Schema: entitlementcard; Owner: postgres
--

GRANT ALL ON TABLE entitlementcard.geometry_columns TO backend;


--
-- Name: TABLE physicalstores; Type: ACL; Schema: entitlementcard; Owner: backend
--

GRANT SELECT ON TABLE entitlementcard.physicalstores TO martin;


--
-- Name: TABLE projects; Type: ACL; Schema: entitlementcard; Owner: backend
--

GRANT SELECT ON TABLE entitlementcard.projects TO martin;


--
-- Name: TABLE regions; Type: ACL; Schema: entitlementcard; Owner: backend
--

GRANT SELECT ON TABLE entitlementcard.regions TO martin;


--
-- Name: TABLE spatial_ref_sys; Type: ACL; Schema: entitlementcard; Owner: postgres
--

GRANT ALL ON TABLE entitlementcard.spatial_ref_sys TO backend;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: entitlementcard; Owner: backend
--

ALTER DEFAULT PRIVILEGES FOR ROLE backend IN SCHEMA entitlementcard GRANT SELECT ON TABLES  TO martin;


--
-- PostgreSQL database dump complete
--