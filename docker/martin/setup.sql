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

-- SRID DB: 4326
-- SRID Output: 3857

CREATE OR REPLACE FUNCTION public.accepting_stores_clustered(z integer, x integer, y integer, query_params json) RETURNS bytea AS
$$
DECLARE
    mvt bytea;
BEGIN
    SELECT INTO mvt ST_AsMVT(tile, 'accepting_stores_clustered', 4096, 'geom')
    FROM (
-- z, x, y
             SELECT kmean,
                    count(*) AS cluster_count,
                    ST_AsMVTGeom(st_centroid(ST_Extent(tsub.wkb_geometry_3857)), TileBBox(z, x, y, 3857), 4096, 64,
                                 false) as geom
             FROM (
                      SELECT ST_ClusterKMeans(tsub1.wkb_geometry, CAST(LEAST(5, (SELECT count(*)
                                                                                 FROM public.verguenstigungen v
                                                                                 WHERE v.wkb_geometry && ST_Transform(TileBBox(z, x, y, 3857), 4326))) AS int))
                             OVER ()                                AS kmean,
                             ST_Transform(tsub1.wkb_geometry, 3857) as wkb_geometry_3857
                      FROM (
                               SELECT v.wkb_geometry
                               FROM public.verguenstigungen v
                               WHERE v.wkb_geometry && ST_Transform(TileBBox(z, x, y, 3857), 4326)
                           ) tsub1
                  ) tsub
             GROUP BY kmean

         ) as tile
    WHERE geom IS NOT NULL;

    RETURN mvt;
END
$$ LANGUAGE plpgsql IMMUTABLE
                    STRICT
                    PARALLEL SAFE;


-- SELECT kmean,
--        count(*) AS cluster_count,
--        ST_AsMVTGeom(st_centroid(ST_Extent(tsub.wkb_geometry_3857)), TileBBox(10, 545, 352, 3857), 4096, 64,
--                     false) as geom
-- FROM (
--          SELECT ST_ClusterKMeans(tsub1.wkb_geometry, CAST(LEAST(5, (SELECT count(*)
--                                                                     FROM public.verguenstigungen v
--                                                                     WHERE v.wkb_geometry && ST_Transform(TileBBox(10, 545, 352, 3857), 4326))) AS int))
--                 OVER ()                                AS kmean,
--                 ST_Transform(tsub1.wkb_geometry, 3857) as wkb_geometry_3857
--          FROM (
--                   SELECT v.wkb_geometry
--                   FROM public.verguenstigungen v
--                   WHERE v.wkb_geometry && ST_Transform(TileBBox(10, 545, 352, 3857), 4326)
--               ) tsub1
--      ) tsub
-- GROUP BY kmean
