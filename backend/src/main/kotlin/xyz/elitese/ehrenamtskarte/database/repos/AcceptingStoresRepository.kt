package xyz.elitese.ehrenamtskarte.database.repos

import org.jetbrains.exposed.sql.and
import org.jetbrains.exposed.sql.exists
import org.jetbrains.exposed.sql.or
import org.jetbrains.exposed.sql.select
import xyz.elitese.ehrenamtskarte.database.*

object AcceptingStoresRepository {

    fun findAll() = AcceptingStoreEntity.all()

    fun findByIds(ids: List<Int>) = AcceptingStoreEntity.find {
        AcceptingStores.id inList ids
    }

    // TODO would be great to support combinations like "Tür an Tür Augsburg"
    fun findBySearch(searchText: String) = AcceptingStoreEntity.find {
        (AcceptingStores.name like "%${searchText}%") or
                (AcceptingStores.description like "%${searchText}%") or
                exists(PhysicalStores.select(
                    PhysicalStores.storeId eq AcceptingStores.id and
                            exists (Addresses.select(
                                Addresses.id eq PhysicalStores.addressId and
                                        (Addresses.location like "%${searchText}%") or
                                        (Addresses.postalCode like "%${searchText}%") or
                                        (Addresses.street like "%${searchText}%")
                            ))
                ))
    }

}
