-- SRID DB: 4326
-- SRID Output: 3857

CREATE OR REPLACE FUNCTION public.accepting_stores_clustered(z integer, x integer, y integer, query_params json) RETURNS bytea AS
$$
DECLARE
    clip_geom     boolean  = false;
    buffer        integer  = 64;
    extend        integer  = 4096;
    mvt           bytea;
    cluster_k     integer  = 3;
    tile_bbox     geometry = TileBBox(z, x, y, 4326);
    bavarian_bbox geometry = ST_MakeEnvelope(13.8350427083, 47.2703623267, 8.9771580802, 50.5644529365, 4326);
BEGIN
    SELECT INTO mvt ST_AsMVT(tile, 'accepting_stores_clustered', extend, 'mvt_geom')
    FROM (
             WITH locations AS (
                 SELECT store.location
                 FROM public.acceptingstores store
                 WHERE store.location && tile_bbox
                   AND store.location && bavarian_bbox
             ),
                  k AS (
                      SELECT CAST(LEAST(cluster_k, COUNT(*)) AS int)
                      FROM locations
                  ),
                  clusters AS (
                      SELECT ST_ClusterKMeans(locations.location, (SELECT * FROM k))
                             OVER () AS cluster_index,
                             locations.location
                      FROM locations
                  )
             SELECT cluster_index,
                    count(*) AS cluster_count,
                    ST_AsMVTGeom(
                            ST_CENTROID(ST_COLLECT(clusters.location)), tile_bbox, extend, buffer,
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
