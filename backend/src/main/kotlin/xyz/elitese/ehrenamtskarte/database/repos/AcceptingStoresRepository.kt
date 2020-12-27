package xyz.elitese.ehrenamtskarte.database.repos

import org.jetbrains.exposed.sql.*
import xyz.elitese.ehrenamtskarte.database.AcceptingStoreEntity
import xyz.elitese.ehrenamtskarte.database.AcceptingStores
import xyz.elitese.ehrenamtskarte.database.Addresses
import xyz.elitese.ehrenamtskarte.database.PhysicalStores

object AcceptingStoresRepository {

    fun findByIds(ids: List<Int>) = AcceptingStoreEntity.find {
        AcceptingStores.id inList ids
    }


    // TODO would be great to support combinations like "Tür an Tür Augsburg"
    // TODO Fulltext search is possible with tsvector in postgres: https://www.compose.com/articles/mastering-postgresql-tools-full-text-search-and-phrase-search/
    // TODO Probably not relevant right now
    fun findBySearch(searchText: String?, categoryIds: List<Int>?): SizedIterable<AcceptingStoreEntity> {
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
                        AcceptingStores.description ilike "%$searchText%",
                        Addresses.location ilike "%$searchText%",
                        Addresses.postalCode ilike "%$searchText%",
                        Addresses.street ilike "%$searchText%"
                    )
                )

        return (AcceptingStores leftJoin PhysicalStores leftJoin Addresses)
            .slice(AcceptingStores.columns)
            .select(categoryMatcher and textMatcher)
            .let { AcceptingStoreEntity.wrapRows(it) }
    }
}

// Postgres' "like" operation uses case sensitive comparison by default.
// Postgres has a builtin "ilike" operation which does case sensitive comparison.

class InsensitiveLikeOp(expr1: Expression<*>, expr2: Expression<*>) : ComparisonOp(expr1, expr2, "ILIKE")

infix fun <T : String?> Expression<T>.ilike(pattern: String): InsensitiveLikeOp =
    InsensitiveLikeOp(this, stringParam(pattern))

