-- SRID DB: 4326
-- SRID Output: 3857

CREATE OR REPLACE FUNCTION physical_stores(z integer, x integer, y integer, query_params json) RETURNS bytea AS
$$
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
$$ LANGUAGE plpgsql IMMUTABLE
                    STRICT
                    PARALLEL SAFE;


-- DEPRECATED: Only used in old ehrenamtskarten app, released January, 2021
CREATE OR REPLACE FUNCTION physical_stores_clustered(z integer, x integer, y integer, query_params json) RETURNS bytea AS
$$
DECLARE
    -- DEPRECATED: Fallback only used in old ehrenamtskarten app, released January, 2021
    project_id text = CASE WHEN query_params::jsonb ? 'project_id' THEN (query_params->>'project_id')::text ELSE 'bayern.ehrenamtskarte.app' END;
BEGIN
    RETURN physical_stores_clusters(z, x, y, project_id);
END
$$ LANGUAGE plpgsql IMMUTABLE
                    STRICT
                    PARALLEL SAFE;


CREATE OR REPLACE FUNCTION physical_stores_points(z integer, x integer, y integer, project_id text) RETURNS bytea AS
$$
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
         ) as tile
    WHERE mvt_geom IS NOT NULL;

    RETURN mvt;
END
$$ LANGUAGE plpgsql IMMUTABLE
                    STRICT
                    PARALLEL SAFE;


CREATE OR REPLACE FUNCTION physical_stores_clusters(z integer, x integer, y integer, project_id text) RETURNS bytea AS
$$
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
$$ LANGUAGE plpgsql IMMUTABLE
                    STRICT
                    PARALLEL SAFE;


create or replace function TileBBox(z int, x int, y int, srid int = 3857)
    returns geometry
    language plpgsql
    immutable as
$func$
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
$func$;
