package app.ehrenamtskarte.backend.db.repositories

import app.ehrenamtskarte.backend.db.columns.GisPointColumn
import app.ehrenamtskarte.backend.db.entities.AcceptingStoreDescriptionEntity
import app.ehrenamtskarte.backend.db.entities.AcceptingStoreDescriptions
import app.ehrenamtskarte.backend.db.entities.AcceptingStoreEntity
import app.ehrenamtskarte.backend.db.entities.AcceptingStores
import app.ehrenamtskarte.backend.db.entities.AddressEntity
import app.ehrenamtskarte.backend.db.entities.Addresses
import app.ehrenamtskarte.backend.db.entities.Categories
import app.ehrenamtskarte.backend.db.entities.ContactEntity
import app.ehrenamtskarte.backend.db.entities.Contacts
import app.ehrenamtskarte.backend.db.entities.PhysicalStoreEntity
import app.ehrenamtskarte.backend.db.entities.PhysicalStores
import app.ehrenamtskarte.backend.db.entities.Projects
import app.ehrenamtskarte.backend.graphql.stores.types.Coordinates
import app.ehrenamtskarte.backend.import.COUNTRY_CODE
import app.ehrenamtskarte.backend.import.stores.common.types.AcceptingStore
import app.ehrenamtskarte.backend.shared.database.sortByKeys
import net.postgis.jdbc.geometry.Point
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.dao.with
import org.jetbrains.exposed.sql.ComparisonOp
import org.jetbrains.exposed.sql.CustomFunction
import org.jetbrains.exposed.sql.DoubleColumnType
import org.jetbrains.exposed.sql.Expression
import org.jetbrains.exposed.sql.Op
import org.jetbrains.exposed.sql.OrOp
import org.jetbrains.exposed.sql.SizedIterable
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.SqlExpressionBuilder.inList
import org.jetbrains.exposed.sql.alias
import org.jetbrains.exposed.sql.and
import org.jetbrains.exposed.sql.deleteReturning
import org.jetbrains.exposed.sql.deleteWhere
import org.jetbrains.exposed.sql.doubleParam
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
        offset: Long,
    ): SizedIterable<AcceptingStoreEntity> {
        val categoryMatcher =
            if (categoryIds == null) {
                Op.TRUE
            } else {
                AcceptingStores.categoryId inList categoryIds
            }

        val textMatcher =
            if (searchText.isNullOrBlank()) {
                Op.TRUE
            } else {
                OrOp(
                    listOf(
                        AcceptingStores.name ilike "%$searchText%",
                        AcceptingStoreDescriptions.description ilike "%$searchText%",
                        Addresses.location ilike "%$searchText%",
                        Addresses.postalCode ilike "%$searchText%",
                        Addresses.street ilike "%$searchText%",
                    ),
                )
            }

        val sortExpression = if (coordinates != null) {
            DistanceFunction(
                PhysicalStores.coordinates,
                MakePointFunction(
                    doubleParam(coordinates.lng),
                    doubleParam(coordinates.lat),
                ),
            ).alias("dist")
        } else {
            AcceptingStores.name
        }

        return (
            Projects innerJoin
                (AcceptingStores leftJoin AcceptingStoreDescriptions leftJoin PhysicalStores leftJoin Addresses)
        ).select(AcceptingStores.columns + sortExpression)
            .withDistinct()
            .where(Projects.project eq project and categoryMatcher and textMatcher)
            .orderBy(sortExpression)
            .limit(limit)
            .offset(offset)
            .let { AcceptingStoreEntity.wrapRows(it) }
    }

    fun getIdIfExists(acceptingStore: AcceptingStore, projectId: EntityID<Int>, regionId: EntityID<Int>?): Int? {
        val stores = (AcceptingStores innerJoin Contacts innerJoin PhysicalStores innerJoin Addresses)
            .leftJoin(AcceptingStoreDescriptions)
            .select(
                AcceptingStores.id,
                AcceptingStoreDescriptions.language,
                AcceptingStoreDescriptions.description,
            ).where {
                (Addresses.street eq acceptingStore.streetWithHouseNumber) and
                    (Addresses.postalCode eq acceptingStore.postalCode!!) and
                    (Addresses.location eq acceptingStore.location) and
                    (Addresses.countryCode eq acceptingStore.countryCode) and
                    (Contacts.email eq acceptingStore.email) and
                    (Contacts.telephone eq acceptingStore.telephone) and
                    (Contacts.website eq acceptingStore.website) and
                    (AcceptingStores.name eq acceptingStore.name) and
                    (AcceptingStores.categoryId eq acceptingStore.categoryId) and
                    (AcceptingStores.regionId eq regionId) and
                    (AcceptingStores.projectId eq projectId) and
                    (PhysicalStores.coordinates eq Point(acceptingStore.longitude!!, acceptingStore.latitude!!))
            }.toList()

        if (stores.isEmpty()) {
            return null
        }

        val storesWithDescriptions = stores.groupBy(
            keySelector = { it[AcceptingStores.id] },
            valueTransform = { row ->
                val language = row.getOrNull(AcceptingStoreDescriptions.language)
                val description = row.getOrNull(AcceptingStoreDescriptions.description)
                if (language != null && description != null) language to description else null
            },
        ).mapValues { (_, descriptionPairs) ->
            descriptionPairs.filterNotNull().toMap()
        }

        val matchingStoreId = storesWithDescriptions.entries
            .find { (_, descriptionMap) -> descriptionMap == acceptingStore.discounts }?.key

        return matchingStoreId?.value
    }

    fun getAllIdsInProject(projectId: EntityID<Int>): MutableSet<Int> =
        AcceptingStores
            .select(AcceptingStores.id)
            .where(AcceptingStores.projectId eq projectId)
            .map { it[AcceptingStores.id].value }.toMutableSet()

    fun createStore(acceptingStore: AcceptingStore, projectId: EntityID<Int>, regionId: EntityID<Int>?) {
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
            contactId = contact.id
            categoryId = EntityID(acceptingStore.categoryId, Categories)
            this.regionId = regionId
            this.projectId = projectId
        }
        PhysicalStoreEntity.new {
            storeId = storeEntity.id
            addressId = address.id
            coordinates = Point(acceptingStore.longitude!!, acceptingStore.latitude!!)
        }
        acceptingStore.discounts.forEach {
            AcceptingStoreDescriptionEntity.new {
                this.storeId = storeEntity.id
                this.description = it.value
                this.language = it.key
            }
        }
    }

    fun editStore(existingStore: AcceptingStoreEntity, acceptingStore: AcceptingStore) {
        existingStore.name = acceptingStore.name
        Categories.select(Categories.id).where { Categories.id eq acceptingStore.categoryId }
            .firstOrNull() ?: throw IllegalStateException("Category not found for id: ${acceptingStore.categoryId}")
        existingStore.categoryId = EntityID(acceptingStore.categoryId, Categories)

        val contact =
            ContactEntity.findById(existingStore.contactId.value)
                ?: throw IllegalStateException("Contact not found for store: ${existingStore.id}")
        contact.email = acceptingStore.email
        contact.telephone = acceptingStore.telephone
        contact.website = acceptingStore.website

        val physicalStore =
            PhysicalStoreEntity.find { PhysicalStores.storeId eq existingStore.id }.firstOrNull()
                ?: throw IllegalStateException("Physical store not found for store: ${existingStore.id}")

        val address =
            AddressEntity.findById(physicalStore.addressId.value)
                ?: throw IllegalStateException("Address not found for store: ${physicalStore.addressId.value}")
        address.street = acceptingStore.streetWithHouseNumber
        address.postalCode =
            acceptingStore.postalCode
                ?: throw IllegalStateException("Postal code must be set for store: ${existingStore.id}")
        address.location = acceptingStore.location

        physicalStore.coordinates = Point(acceptingStore.longitude!!, acceptingStore.latitude!!)

        AcceptingStoreDescriptions.deleteWhere { storeId eq existingStore.id }
        acceptingStore.discounts.forEach {
            AcceptingStoreDescriptionEntity.new {
                this.storeId = existingStore.id
                this.description = it.value
                this.language = it.key
            }
        }
    }

    /** Delete a list of accepting stores, their associated data and return the deleted store IDs */
    fun deleteStores(acceptingStoreIds: Iterable<Int>): List<EntityID<Int>> {
        val contactsDelete = (AcceptingStores innerJoin Contacts)
            .select(Contacts.id)
            .where { AcceptingStores.id inList acceptingStoreIds }
            .map { it[Contacts.id] }

        val addressesDelete = ((PhysicalStores innerJoin Addresses) innerJoin AcceptingStores)
            .select(Addresses.id)
            .where { AcceptingStores.id inList acceptingStoreIds }
            .map { it[Addresses.id] }

        AcceptingStoreDescriptions.deleteWhere { storeId inList acceptingStoreIds }
        PhysicalStores.deleteWhere { storeId inList acceptingStoreIds }
        Addresses.deleteWhere { id inList addressesDelete }

        val deletedAcceptingStoreIds =
            AcceptingStores.deleteReturning(listOf(AcceptingStores.id)) { AcceptingStores.id inList acceptingStoreIds }
                .map { it[AcceptingStores.id] }.toList()

        Contacts.deleteWhere { id inList contactsDelete }

        return deletedAcceptingStoreIds
    }

    fun findByIds(ids: List<Int>) =
        AcceptingStoreEntity.find { AcceptingStores.id inList ids }.sortByKeys({ it.id.value }, ids)

    fun findByPhysicalStoreIdsInProject(project: String, physicalStoreIds: List<Int>): List<AcceptingStoreEntity> =
        (Projects innerJoin AcceptingStores innerJoin PhysicalStores)
            .select(AcceptingStores.columns)
            .where { Projects.project eq project and (PhysicalStores.id inList physicalStoreIds) }
            .let { AcceptingStoreEntity.wrapRows(it) }
            .with(AcceptingStoreEntity::descriptions)
            .toList()
}

// Postgres' "like" operation uses case-sensitive comparison by default.
// Postgres has a builtin "ilike" operation which does case-sensitive comparison.
class InsensitiveLikeOp(expr1: Expression<*>, expr2: Expression<*>) : ComparisonOp(expr1, expr2, "ILIKE")

infix fun <T : String?> Expression<T>.ilike(pattern: String): InsensitiveLikeOp =
    InsensitiveLikeOp(this, stringParam(pattern))

class DistanceFunction(expr1: Expression<Point>, expr2: Expression<Point>) :
    CustomFunction<Double>("ST_DistanceSphere", DoubleColumnType(), expr1, expr2)

// https://postgis.net/docs/ST_MakePoint.html
class MakePointFunction(expr1: Expression<Double>, expr2: Expression<Double>) :
    CustomFunction<Point>("ST_MakePoint", GisPointColumn(), expr1, expr2)
