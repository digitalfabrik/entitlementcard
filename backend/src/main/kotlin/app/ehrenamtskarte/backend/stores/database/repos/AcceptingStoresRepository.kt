package app.ehrenamtskarte.backend.stores.database.repos

import app.ehrenamtskarte.backend.common.database.sortByKeys
import app.ehrenamtskarte.backend.projects.database.ProjectEntity
import app.ehrenamtskarte.backend.projects.database.Projects
import app.ehrenamtskarte.backend.regions.database.RegionEntity
import app.ehrenamtskarte.backend.regions.database.repos.RegionsRepository
import app.ehrenamtskarte.backend.stores.COUNTRY_CODE
import app.ehrenamtskarte.backend.stores.database.AcceptingStoreEntity
import app.ehrenamtskarte.backend.stores.database.AcceptingStores
import app.ehrenamtskarte.backend.stores.database.AddressEntity
import app.ehrenamtskarte.backend.stores.database.Addresses
import app.ehrenamtskarte.backend.stores.database.Categories
import app.ehrenamtskarte.backend.stores.database.ContactEntity
import app.ehrenamtskarte.backend.stores.database.Contacts
import app.ehrenamtskarte.backend.stores.database.PhysicalStoreEntity
import app.ehrenamtskarte.backend.stores.database.PhysicalStores
import app.ehrenamtskarte.backend.stores.importer.common.types.AcceptingStore
import app.ehrenamtskarte.backend.stores.utils.mapCsvToStore
import app.ehrenamtskarte.backend.stores.webservice.schema.types.CSVAcceptingStore
import app.ehrenamtskarte.backend.stores.webservice.schema.types.Coordinates
import app.ehrenamtskarte.backend.stores.webservice.schema.types.StoreImportReturnResultModel
import net.postgis.jdbc.geometry.Point
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.sql.ComparisonOp
import org.jetbrains.exposed.sql.CustomFunction
import org.jetbrains.exposed.sql.DoubleColumnType
import org.jetbrains.exposed.sql.Expression
import org.jetbrains.exposed.sql.Op
import org.jetbrains.exposed.sql.OrOp
import org.jetbrains.exposed.sql.SizedIterable
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.SqlExpressionBuilder.inList
import org.jetbrains.exposed.sql.and
import org.jetbrains.exposed.sql.deleteWhere
import org.jetbrains.exposed.sql.doubleParam
import org.jetbrains.exposed.sql.select
import org.jetbrains.exposed.sql.stringParam

object AcceptingStoresRepository {

    // TODO would be great to support combinations like "Tür an Tür Augsburg"
    // TODO Fulltext search is possible with tsvector in postgres: https://www.compose.com/articles/mastering-postgresql-tools-full-text-search-and-phrase-search/
    // TODO Probably not relevant right now
    fun findBySearch(
        project: String,
        searchText: String?,
        categoryIds: List<Int>?,
        coordinates: Coordinates?,
        limit: Int,
        offset: Long
    ): SizedIterable<AcceptingStoreEntity> {
        val categoryMatcher =
            if (categoryIds == null) {
                Op.TRUE
            } else {
                Op.build { AcceptingStores.categoryId inList categoryIds }
            }

        val textMatcher =
            if (searchText == null) {
                Op.TRUE
            } else {
                OrOp(
                    listOf(
                        AcceptingStores.name ilike "%$searchText%",
                        AcceptingStores.description ilike "%$searchText%",
                        Addresses.location ilike "%$searchText%",
                        Addresses.postalCode ilike "%$searchText%",
                        Addresses.street ilike "%$searchText%"
                    )
                )
            }

        val sortExpression = if (coordinates != null) {
            DistanceFunction(
                PhysicalStores.coordinates,
                MakePointFunction(doubleParam(coordinates.lng), doubleParam(coordinates.lat))
            )
        } else {
            AcceptingStores.name
        }

        return (Projects innerJoin (AcceptingStores leftJoin PhysicalStores leftJoin Addresses))
            .slice(AcceptingStores.columns)
            .select(Projects.project eq project and categoryMatcher and textMatcher)
            .orderBy(sortExpression)
            .let { AcceptingStoreEntity.wrapRows(it) }
            .limit(limit, offset)
    }

    fun getIdIfExists(
        acceptingStore: AcceptingStore,
        projectId: EntityID<Int>,
        regionId: EntityID<Int>?
    ): Int? {
        return AcceptingStores.innerJoin(PhysicalStores).innerJoin(Addresses).innerJoin(Contacts)
            .slice(AcceptingStores.id).select {
                (Addresses.street eq acceptingStore.streetWithHouseNumber) and
                    (Addresses.postalCode eq acceptingStore.postalCode!!) and
                    (Addresses.location eq acceptingStore.location) and
                    (Addresses.countryCode eq acceptingStore.countryCode) and
                    (Contacts.email eq acceptingStore.email) and
                    (Contacts.telephone eq acceptingStore.telephone) and
                    (Contacts.website eq acceptingStore.website) and
                    (AcceptingStores.name eq acceptingStore.name) and
                    (AcceptingStores.description eq acceptingStore.discount) and
                    (AcceptingStores.categoryId eq acceptingStore.categoryId) and
                    (AcceptingStores.regionId eq regionId) and
                    (AcceptingStores.projectId eq projectId) and
                    (
                        PhysicalStores.coordinates eq Point(
                            acceptingStore.longitude!!,
                            acceptingStore.latitude!!
                        )
                        )
            }.firstOrNull()?.let { it[AcceptingStores.id].value }
    }

    fun importAcceptingStores(stores: List<CSVAcceptingStore>, project: ProjectEntity, dryRun: Boolean): StoreImportReturnResultModel {
        var numStoresCreated = 0
        var numStoresUntouched = 0
        val projectId = project.id
        val region = RegionsRepository.findAllInProject(project.project).let {
            if (it.size == 1) {
                it.first()
            } else {
                null
            }
        }
        val acceptingStoreIdsToRemove =
            AcceptingStores.slice(AcceptingStores.id).select { AcceptingStores.projectId eq projectId }
                .map { it[AcceptingStores.id].value }.toMutableSet()
        stores.map { mapCsvToStore(it) }.forEach {
            val existingStoreId = getIdIfExists(it, projectId, region?.id)
            if (existingStoreId == null) {
                if (!dryRun) {
                    createStore(it, projectId, region)
                }
                numStoresCreated += 1
            } else {
                acceptingStoreIdsToRemove.remove(existingStoreId)
                numStoresUntouched += 1
            }
        }
        if (!dryRun) {
            deleteStores(acceptingStoreIdsToRemove)
        }

        return StoreImportReturnResultModel(numStoresCreated, acceptingStoreIdsToRemove.size, numStoresUntouched)
    }

    fun createStore(acceptingStore: AcceptingStore, currentProjectId: EntityID<Int>, region: RegionEntity?) {
        val address = AddressEntity.new {
            street = acceptingStore.streetWithHouseNumber
            postalCode = acceptingStore.postalCode!!
            location = acceptingStore.location
            countryCode = COUNTRY_CODE
        }
        val contact = ContactEntity.new {
            email = acceptingStore.email
            telephone = acceptingStore.telephone
            website = acceptingStore.website
        }
        val storeEntity = AcceptingStoreEntity.new {
            name = acceptingStore.name
            description = acceptingStore.discount
            contactId = contact.id
            categoryId = EntityID(acceptingStore.categoryId, Categories)
            regionId = region?.id
            projectId = currentProjectId
        }
        PhysicalStoreEntity.new {
            storeId = storeEntity.id
            addressId = address.id
            coordinates = Point(acceptingStore.longitude!!, acceptingStore.latitude!!)
        }
    }

    fun deleteStores(acceptingStoreIds: Iterable<Int>) {
        val contactsDelete =
            (AcceptingStores innerJoin Contacts).slice(Contacts.id)
                .select { AcceptingStores.id inList acceptingStoreIds }
                .map { it[Contacts.id] }

        val physicalStoresDelete =
            (PhysicalStores innerJoin AcceptingStores).slice(PhysicalStores.id)
                .select { AcceptingStores.id inList acceptingStoreIds }
                .map { it[PhysicalStores.id] }

        val addressesDelete =
            ((PhysicalStores innerJoin Addresses) innerJoin AcceptingStores).slice(Addresses.id)
                .select { AcceptingStores.id inList acceptingStoreIds }
                .map { it[Addresses.id] }

        PhysicalStores.deleteWhere {
            id inList physicalStoresDelete
        }

        Addresses.deleteWhere {
            id inList addressesDelete
        }

        AcceptingStores.deleteWhere {
            id inList acceptingStoreIds
        }

        Contacts.deleteWhere {
            id inList contactsDelete
        }
    }

    fun findByIds(ids: List<Int>) =
        AcceptingStoreEntity.find { AcceptingStores.id inList ids }.sortByKeys({ it.id.value }, ids)
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
