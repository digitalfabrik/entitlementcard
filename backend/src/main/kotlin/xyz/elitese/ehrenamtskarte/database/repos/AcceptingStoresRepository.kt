package xyz.elitese.ehrenamtskarte.database.repos

import org.jetbrains.exposed.sql.*
import org.postgis.Point
import xyz.elitese.ehrenamtskarte.database.*
import xyz.elitese.ehrenamtskarte.webservice.schema.types.Coordinates

object AcceptingStoresRepository {

    fun findByIds(ids: List<Int>) =
        AcceptingStoreEntity.find { AcceptingStores.id inList ids }.sortByKeys({ it.id.value }, ids)


    // TODO would be great to support combinations like "Tür an Tür Augsburg"
    // TODO Fulltext search is possible with tsvector in postgres: https://www.compose.com/articles/mastering-postgresql-tools-full-text-search-and-phrase-search/
    // TODO Probably not relevant right now
    fun findBySearch(
        searchText: String?, categoryIds: List<Int>?, coordinates: Coordinates?
    ): SizedIterable<AcceptingStoreEntity> {
        val categoryMatcher =
            if (categoryIds == null)
                Op.TRUE
            else
                Op.build { AcceptingStores.categoryId inList categoryIds }

        val textMatcher =
            if (searchText == null)
                Op.TRUE
            else
                OrOp(
                    listOf(
                        AcceptingStores.name ilike "%$searchText%",
                        AcceptingStores.description ilike "%$searchText%",
                        Addresses.location ilike "%$searchText%",
                        Addresses.postalCode ilike "%$searchText%",
                        Addresses.street ilike "%$searchText%"
                    )
                )

        val sortExpression = if (coordinates != null)
            DistanceFunction(
                PhysicalStores.coordinates,
                MakePointFunction(doubleParam(coordinates.lng), doubleParam(coordinates.lat))
            )
        else
            AcceptingStores.name

        return (AcceptingStores leftJoin PhysicalStores leftJoin Addresses)
            .slice(AcceptingStores.columns)
            .select(categoryMatcher and textMatcher)
            .orderBy(sortExpression)
            .let { AcceptingStoreEntity.wrapRows(it) }
    }
}


// Postgres' "like" operation uses case sensitive comparison by default.
// Postgres has a builtin "ilike" operation which does case sensitive comparison.
class InsensitiveLikeOp(expr1: Expression<*>, expr2: Expression<*>) : ComparisonOp(expr1, expr2, "ILIKE")

infix fun <T : String?> Expression<T>.ilike(pattern: String): InsensitiveLikeOp =
    InsensitiveLikeOp(this, stringParam(pattern))

class DistanceFunction(expr1: Expression<Point>, expr2: Expression<Point>) :
    CustomFunction<Double>("ST_DistanceSphere", DoubleColumnType(), expr1, expr2)

class MakePointFunction(expr1: Expression<Double>, expr2: Expression<Double>) :
    CustomFunction<Point>("ST_MakePoint", DoubleColumnType(), expr1, expr2)

