CREATE OR REPLACE FUNCTION public.physical_stores(z integer, x integer, y integer, query_params json) RETURNS bytea AS
$$
DECLARE
    clip_geom boolean = false;
    buffer    integer = 64;
    extend    integer = 4096;
    mvt       bytea;
BEGIN
    SELECT INTO mvt ST_AsMVT(tile, 'public.physical_stores', 4096, 'mvt_geom')
    FROM (
             SELECT ST_AsMVTGeom(ST_Transform(coordinates, 3857), TileBBox(z, x, y, 3857), extend, buffer,
                                 clip_geom) AS mvt_geom,
                    physicalstores.id,
                    acceptingstores."categoryId"
             FROM public.physicalstores
                      JOIN public.acceptingstores ON acceptingstores.id = physicalstores."storeId"
             WHERE coordinates && TileBBox(z, x, y, 4326)
         ) as tile
    WHERE mvt_geom IS NOT NULL;

    RETURN mvt;
END
$$ LANGUAGE plpgsql IMMUTABLE
                    STRICT
                    PARALLEL SAFE;
