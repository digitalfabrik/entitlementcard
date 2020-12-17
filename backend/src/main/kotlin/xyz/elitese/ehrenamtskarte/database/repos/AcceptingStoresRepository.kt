package xyz.elitese.ehrenamtskarte.database.repos

import org.jetbrains.exposed.sql.*
import xyz.elitese.ehrenamtskarte.database.AcceptingStoreEntity
import xyz.elitese.ehrenamtskarte.database.AcceptingStores
import xyz.elitese.ehrenamtskarte.database.Addresses
import xyz.elitese.ehrenamtskarte.database.PhysicalStores

object AcceptingStoresRepository {

    fun findAll() = AcceptingStoreEntity.all()

    fun findByIds(ids: List<Int>) = AcceptingStoreEntity.find {
        AcceptingStores.id inList ids
    }


    // TODO would be great to support combinations like "Tür an Tür Augsburg"
    // TODO Fulltext search is possible with tsvector in postgres: https://www.compose.com/articles/mastering-postgresql-tools-full-text-search-and-phrase-search/
    // TODO Probably not relevant right now
    fun findBySearch(searchText: String?, categoryIds: List<Int>?): SizedIterable<AcceptingStoreEntity> {
        val matchCategoryIds = if (categoryIds != null) Op.build { AcceptingStores.categoryId inList categoryIds } else Op.TRUE
        val matchSearchText = if (searchText != null) Op.build {
            ((AcceptingStores.name like "%${searchText}%") or
                    (AcceptingStores.description like "%${searchText}%") or
                    exists(PhysicalStores.select(
                            PhysicalStores.storeId eq AcceptingStores.id and
                                    exists(Addresses.select(
                                            Addresses.id eq PhysicalStores.addressId and
                                                    (Addresses.location like "%${searchText}%") or
                                                    (Addresses.postalCode like "%${searchText}%") or
                                                    (Addresses.street like "%${searchText}%")
                                    ))
                    )))
        } else Op.TRUE
        return AcceptingStoreEntity.find {
            matchSearchText.and(matchCategoryIds)
        }
    }
}
