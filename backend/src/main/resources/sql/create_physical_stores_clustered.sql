-- SRID DB: 4326
-- SRID Output: 3857

CREATE OR REPLACE FUNCTION physical_stores_clustered(z integer, x integer, y integer, query_params json) RETURNS bytea AS
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
                 WHERE store.coordinates && tile_bbox
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
