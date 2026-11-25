// AcceptingStore/PhysicalStore (V1) are kept for GraphQL backward compatibility until January 2028.
// searchAcceptingStoresInProjectV2 is kept for GraphQL backward compatibility until December 2028.
@file:Suppress("DEPRECATION")

package app.ehrenamtskarte.backend.graphql.stores

import app.ehrenamtskarte.backend.config.BackendConfiguration
import app.ehrenamtskarte.backend.config.ProjectConfig
import app.ehrenamtskarte.backend.db.entities.AcceptingStoreEntity
import app.ehrenamtskarte.backend.db.repositories.AcceptingStoresRepository
import app.ehrenamtskarte.backend.db.repositories.PhysicalStoresRepository
import app.ehrenamtskarte.backend.graphql.shared.DEFAULT_PROJECT
import app.ehrenamtskarte.backend.graphql.shared.types.IdsParams
import app.ehrenamtskarte.backend.graphql.stores.types.AcceptingStore
import app.ehrenamtskarte.backend.graphql.stores.types.AcceptingStoreSearchResult
import app.ehrenamtskarte.backend.graphql.stores.types.AcceptingStoreV2
import app.ehrenamtskarte.backend.graphql.stores.types.Coordinates
import app.ehrenamtskarte.backend.graphql.stores.types.PhysicalStore
import app.ehrenamtskarte.backend.graphql.stores.types.SearchParams
import app.ehrenamtskarte.backend.shared.Matomo
import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import com.expediagroup.graphql.generator.annotations.GraphQLIgnore
import graphql.schema.DataFetchingEnvironment
import jakarta.servlet.http.HttpServletRequest
import org.jetbrains.exposed.v1.dao.with
import org.jetbrains.exposed.v1.jdbc.transactions.transaction
import org.springframework.graphql.data.method.annotation.Argument
import org.springframework.graphql.data.method.annotation.ContextValue
import org.springframework.graphql.data.method.annotation.QueryMapping
import org.springframework.stereotype.Controller

@Controller
class AcceptingStoreQueryController(
    private val backendConfig: BackendConfiguration,
    private val matomo: Matomo,
) {
    @Deprecated(
        "Use acceptingStoresByPhysicalStoreIdsInProject query for localized descriptions. Can be safely removed in January 2028.",
    )
    @GraphQLDescription("Returns list of all accepting stores in the given project queried by ids.")
    @QueryMapping
    fun physicalStoresByIdInProject(
        @Argument project: String,
        @Argument ids: List<Int>,
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

    @Deprecated(
        "Use acceptingStoresByPhysicalStoreIdsInProject query for localized descriptions. Can be safely removed in January 2028.",
    )
    @GraphQLDescription(
        "Returns list of all accepting stores queried by ids in the eak bayern project.",
    )
    fun physicalStoresById(params: IdsParams) = physicalStoresByIdInProject(DEFAULT_PROJECT, params.ids)

    @Deprecated(
        "Use searchAcceptingStoresInProjectV2 query for localized descriptions. Can be safely removed in January 2028.",
    )
    @GraphQLDescription(
        "Search for accepting stores in the given project using searchText and categoryIds.",
    )
    @QueryMapping
    fun searchAcceptingStoresInProject(
        @Argument project: String,
        @Argument params: SearchParams,
        dfe: DataFetchingEnvironment,
        @GraphQLIgnore @ContextValue request: HttpServletRequest,
    ): List<AcceptingStore> {
        val projectConfig = backendConfig.getProjectConfig(project)
        val filteredStores = transaction {
            AcceptingStoresRepository.findBySearch(
                project = project,
                searchText = params.searchText,
                categoryIds = params.categoryIds,
                coordinates = params.coordinates,
                limit = params.limit ?: Int.MAX_VALUE,
                offset = params.offset ?: 0,
            ).with(AcceptingStoreEntity::descriptions)
                .map { AcceptingStore.fromDbEntity(it) }
        }
        matomo.trackSearch(
            projectConfig = projectConfig,
            request = request,
            query = dfe.field.name,
            params = params,
            numResults = filteredStores.size,
        )
        return filteredStores
    }

    @Deprecated(
        "Use searchAcceptingStoresInProjectV3 query for the total result count. Can be safely removed in December 2028.",
    )
    @GraphQLDescription(
        "Search for accepting stores in the given project using searchText and categoryIds.",
    )
    @QueryMapping
    fun searchAcceptingStoresInProjectV2(
        @Argument project: String,
        @Argument params: SearchParams,
        dfe: DataFetchingEnvironment,
        @GraphQLIgnore @ContextValue request: HttpServletRequest,
    ): List<AcceptingStoreV2> {
        val projectConfig = backendConfig.getProjectConfig(project)
        val stores = transaction { findStores(project, params) }
        trackSearch(projectConfig, params, dfe, request, numResults = stores.size)
        return stores
    }

    @GraphQLDescription(
        "Search for accepting stores in the given project using searchText and categoryIds. " +
            "Additionally returns the total number of matching stores.",
    )
    @QueryMapping
    fun searchAcceptingStoresInProjectV3(
        @Argument project: String,
        @Argument params: SearchParams,
        dfe: DataFetchingEnvironment,
        @GraphQLIgnore @ContextValue request: HttpServletRequest,
    ): AcceptingStoreSearchResult {
        val projectConfig = backendConfig.getProjectConfig(project)
        val result = transaction {
            AcceptingStoreSearchResult(
                stores = findStores(project, params),
                totalCount = if ((params.offset ?: 0) == 0L) {
                    AcceptingStoresRepository.countBySearch(project, params.searchText, params.categoryIds).toInt()
                } else {
                    null
                },
            )
        }
        trackSearch(projectConfig, params, dfe, request, numResults = result.stores.size)
        return result
    }

    private fun findStores(project: String, params: SearchParams): List<AcceptingStoreV2> =
        AcceptingStoresRepository.findBySearch(
            project = project,
            searchText = params.searchText,
            categoryIds = params.categoryIds,
            coordinates = params.coordinates,
            limit = params.limit ?: Int.MAX_VALUE,
            offset = params.offset ?: 0,
        ).with(AcceptingStoreEntity::descriptions)
            .map { AcceptingStoreV2.fromDbEntity(it) }

    private fun trackSearch(
        projectConfig: ProjectConfig,
        params: SearchParams,
        dfe: DataFetchingEnvironment,
        request: HttpServletRequest,
        numResults: Int,
    ) {
        matomo.trackSearch(
            projectConfig = projectConfig,
            request = request,
            query = dfe.field.name,
            params = params,
            numResults = numResults,
        )
    }

    @GraphQLDescription("Returns accepting stores in the given project queried by physical store ids.")
    @QueryMapping
    fun acceptingStoresByPhysicalStoreIdsInProject(
        @Argument project: String,
        @Argument physicalStoreIds: List<Int>,
    ): List<AcceptingStoreV2> =
        transaction {
            AcceptingStoresRepository.findByPhysicalStoreIdsInProject(project, physicalStoreIds)
                .map { AcceptingStoreV2.fromDbEntity(it) }
        }
}
