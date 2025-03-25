package app.ehrenamtskarte.backend.stores.webservice.schema

import app.ehrenamtskarte.backend.common.webservice.DEFAULT_PROJECT
import app.ehrenamtskarte.backend.common.webservice.GraphQLContext
import app.ehrenamtskarte.backend.common.webservice.schema.IdsParams
import app.ehrenamtskarte.backend.matomo.Matomo
import app.ehrenamtskarte.backend.stores.database.repos.AcceptingStoresRepository
import app.ehrenamtskarte.backend.stores.database.repos.PhysicalStoresRepository
import app.ehrenamtskarte.backend.stores.webservice.schema.types.AcceptingStore
import app.ehrenamtskarte.backend.stores.webservice.schema.types.Coordinates
import app.ehrenamtskarte.backend.stores.webservice.schema.types.PhysicalStore
import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import graphql.schema.DataFetchingEnvironment
import org.jetbrains.exposed.sql.transactions.transaction

@Suppress("unused")
class AcceptingStoreQueryService {
    @GraphQLDescription("Returns list of all accepting stores in the given project.")
    fun physicalStoresInProject(project: String): List<PhysicalStore> =
        transaction {
            PhysicalStoresRepository.findAllInProject(project).map {
                PhysicalStore(
                    it.id.value,
                    it.storeId.value,
                    it.addressId.value,
                    Coordinates(it.coordinates.x, it.coordinates.y),
                )
            }
        }

    @GraphQLDescription("Returns list of all accepting stores in the given project queried by ids.")
    fun physicalStoresByIdInProject(
        project: String,
        ids: List<Int>,
    ): List<PhysicalStore?> =
        transaction {
            PhysicalStoresRepository.findByIdsInProject(project, ids).map {
                if (it == null) {
                    null
                } else {
                    PhysicalStore(
                        it.id.value,
                        it.storeId.value,
                        it.addressId.value,
                        Coordinates(it.coordinates.x, it.coordinates.y),
                    )
                }
            }
        }

    @GraphQLDescription(
        "Search for accepting stores in the given project using searchText and categoryIds.",
    )
    fun searchAcceptingStoresInProject(
        project: String,
        params: SearchParams,
        dfe: DataFetchingEnvironment,
    ): List<AcceptingStore> {
        val context = dfe.getContext<GraphQLContext>()
        val projectConfig = context.backendConfiguration.getProjectConfig(project)
        val filteredStores = transaction {
            AcceptingStoresRepository.findBySearch(
                project,
                params.searchText,
                params.categoryIds,
                params.coordinates,
                params.limit ?: Int.MAX_VALUE,
                params.offset ?: 0,
            ).map {
                AcceptingStore(
                    it.id.value,
                    it.name,
                    it.description,
                    it.contactId.value,
                    it.categoryId.value,
                )
            }
        }
        Matomo.trackSearch(
            context.backendConfiguration,
            projectConfig,
            context.request,
            dfe.field.name,
            params,
            filteredStores.size,
        )
        return filteredStores
    }

    @Deprecated(
        "Deprecated in favor of project specific query",
        ReplaceWith("physicalStoresInProject"),
    )
    @GraphQLDescription("Return list of all accepting stores in the eak bayern project.")
    fun physicalStores(): List<PhysicalStore> = physicalStoresInProject(DEFAULT_PROJECT)

    @Deprecated(
        "Deprecated in favor of project specific query",
        ReplaceWith("physicalStoresByIdInProject"),
    )
    @GraphQLDescription(
        "Returns list of all accepting stores queried by ids in the eak bayern project.",
    )
    fun physicalStoresById(params: IdsParams) = physicalStoresByIdInProject(DEFAULT_PROJECT, params.ids)

    @Deprecated(
        "Deprecated in favor of project specific query",
        ReplaceWith("searchAcceptingStoresInProject"),
    )
    @GraphQLDescription(
        "Search for accepting stores using searchText and categoryIds in the eak bayern project.",
    )
    fun searchAcceptingStores(
        params: SearchParams,
        dfe: DataFetchingEnvironment,
    ): List<AcceptingStore> = searchAcceptingStoresInProject(DEFAULT_PROJECT, params, dfe)
}

data class SearchParams(
    val searchText: String?,
    val categoryIds: List<Int>?,
    val coordinates: Coordinates?,
    val limit: Int?,
    val offset: Long?,
)
