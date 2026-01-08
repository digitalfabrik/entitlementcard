package app.ehrenamtskarte.backend.graphql.stores

import app.ehrenamtskarte.backend.config.BackendConfiguration
import app.ehrenamtskarte.backend.db.entities.AcceptingStoreEntity
import app.ehrenamtskarte.backend.db.repositories.AcceptingStoresRepository
import app.ehrenamtskarte.backend.db.repositories.PhysicalStoresRepository
import app.ehrenamtskarte.backend.graphql.stores.types.AcceptingStore
import app.ehrenamtskarte.backend.graphql.stores.types.Coordinates
import app.ehrenamtskarte.backend.graphql.stores.types.PhysicalStore
import app.ehrenamtskarte.backend.graphql.stores.types.SearchParams
import app.ehrenamtskarte.backend.shared.Matomo
import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import com.expediagroup.graphql.generator.annotations.GraphQLIgnore
import graphql.schema.DataFetchingEnvironment
import jakarta.servlet.http.HttpServletRequest
import org.jetbrains.exposed.dao.with
import org.jetbrains.exposed.sql.transactions.transaction
import org.springframework.graphql.data.method.annotation.Argument
import org.springframework.graphql.data.method.annotation.ContextValue
import org.springframework.graphql.data.method.annotation.QueryMapping
import org.springframework.stereotype.Controller

@Controller
class AcceptingStoreQueryController(
    private val backendConfig: BackendConfiguration,
) {
    @GraphQLDescription("Returns list of all accepting stores in the given project.")
    @QueryMapping
    fun physicalStoresInProject(
        @Argument project: String,
    ): List<PhysicalStore> =
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
        "Use searchAcceptingStoresInProjectV2 for localized descriptions. Should be able to safely remove in January 2028.",
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
                project,
                params.searchText,
                params.categoryIds,
                params.coordinates,
                params.limit ?: Int.MAX_VALUE,
                params.offset ?: 0,
            ).with(AcceptingStoreEntity::descriptions)
                .map { AcceptingStore.fromDbEntity(it) }
        }
        Matomo.trackSearch(
            backendConfig,
            projectConfig,
            request,
            dfe.field.name,
            params,
            filteredStores.size,
        )
        return filteredStores
    }
}
