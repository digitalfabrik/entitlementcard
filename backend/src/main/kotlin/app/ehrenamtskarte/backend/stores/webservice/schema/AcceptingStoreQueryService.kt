package app.ehrenamtskarte.backend.stores.webservice.schema

import app.ehrenamtskarte.backend.stores.database.repos.AcceptingStoresRepository
import app.ehrenamtskarte.backend.stores.database.repos.PhysicalStoresRepository
import app.ehrenamtskarte.backend.stores.webservice.schema.types.AcceptingStore
import app.ehrenamtskarte.backend.stores.webservice.schema.types.Coordinates
import app.ehrenamtskarte.backend.stores.webservice.schema.types.PhysicalStore
import com.expediagroup.graphql.annotations.GraphQLDescription
import org.jetbrains.exposed.sql.transactions.transaction

@Suppress("unused")
class AcceptingStoreQueryService {

    @GraphQLDescription("Returns list of all accepting stores in the given project.")
    fun physicalStoresInProject(project: String): List<PhysicalStore> = transaction {
        PhysicalStoresRepository.findAllInProject(project).map {
            PhysicalStore(
                it.id.value,
                it.storeId.value,
                it.addressId.value,
                Coordinates(it.coordinates.x, it.coordinates.y)
            )
        }
    }

    @GraphQLDescription("Returns list of all accepting stores in the given project queried by ids.")
    fun physicalStoresByIdInProject(project: String, ids: List<Int>): List<PhysicalStore?> = transaction {
        PhysicalStoresRepository.findByIdsInProject(project, ids).map {
            if (it == null) null
            else PhysicalStore(
                it.id.value,
                it.storeId.value,
                it.addressId.value,
                Coordinates(it.coordinates.x, it.coordinates.y)
            )
        }
    }

    @GraphQLDescription("Search for accepting stores in the given project using searchText and categoryIds.")
    fun searchAcceptingStoresInProject(project: String, params: SearchParams): List<AcceptingStore> = transaction {
        AcceptingStoresRepository.findBySearch(
            project,
            params.searchText,
            params.categoryIds,
            params.coordinates,
            params.limit ?: Int.MAX_VALUE,
            params.offset ?: 0
        ).map {
            AcceptingStore(it.id.value, it.name, it.description, it.contactId.value, it.categoryId.value)
        }
    }
}

data class SearchParams(
    val searchText: String?,
    val categoryIds: List<Int>?,
    val coordinates: Coordinates?,
    val limit: Int?,
    val offset: Long?
)
