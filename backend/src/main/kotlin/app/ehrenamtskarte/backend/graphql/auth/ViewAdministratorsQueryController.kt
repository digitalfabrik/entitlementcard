package app.ehrenamtskarte.backend.graphql.auth

import app.ehrenamtskarte.backend.db.entities.AdministratorEntity
import app.ehrenamtskarte.backend.db.entities.Administrators
import app.ehrenamtskarte.backend.db.entities.RegionEntity
import app.ehrenamtskarte.backend.db.entities.Regions
import app.ehrenamtskarte.backend.db.entities.mayViewUsersInProject
import app.ehrenamtskarte.backend.db.entities.mayViewUsersInRegion
import app.ehrenamtskarte.backend.graphql.auth.types.Administrator
import app.ehrenamtskarte.backend.graphql.exceptions.RegionNotFoundException
import app.ehrenamtskarte.backend.shared.exceptions.ForbiddenException
import app.ehrenamtskarte.backend.shared.exceptions.UnauthorizedException
import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import graphql.schema.DataFetchingEnvironment
import org.dataloader.DataLoaderRegistry
import org.jetbrains.exposed.sql.SortOrder
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.and
import org.jetbrains.exposed.sql.not
import org.jetbrains.exposed.sql.transactions.transaction
import org.springframework.graphql.data.method.annotation.Argument
import org.springframework.graphql.data.method.annotation.QueryMapping
import org.springframework.graphql.execution.BatchLoaderRegistry
import org.springframework.graphql.execution.DefaultBatchLoaderRegistry
import org.springframework.stereotype.Controller
import app.ehrenamtskarte.backend.graphql.regions.types.Region
import org.springframework.graphql.data.method.annotation.SchemaMapping
import java.awt.print.Book
import java.util.concurrent.CompletableFuture


@Controller
class ViewAdministratorsQueryController(
    private val registry: BatchLoaderRegistry,
) {
    @GraphQLDescription("Returns the requesting administrator as retrieved from his JWT token.")
    @QueryMapping
    fun whoAmI(dfe: DataFetchingEnvironment): Administrator {
        val regionLoader = dfe.getDataLoader<Int, Region>(Region::class.java.getName())

        // val dataLoaderRegistry = DataLoaderRegistry.newRegistry().build()
       // registry.registerDataLoaders(dataLoaderRegistry, dfe.graphQlContext)
       // val loader = dataLoaderRegistry.getDataLoader<Int, Region>(Region::class.java.simpleName)
       // val dataLoader = dfe.getDataLoader<Int, Region>(Region::class.java.simpleName)

        val authContext = dfe.requireAuthContext()
        val admin = authContext.admin

        return transaction {
            if (admin.deleted) {
                throw UnauthorizedException()
            }
            Administrator.fromDbEntity(admin)
        }
    }

    @SchemaMapping
    fun region(admin: Administrator, dfe: DataFetchingEnvironment): CompletableFuture<Region> {
        val regionLoader = dfe.getDataLoader<Int, Region>(Region::class.java.getName())
        return regionLoader!!.load(admin.regionId)
    }

    @GraphQLDescription(
        "Returns all administrators in a project. This query requires the role PROJECT_ADMIN.",
    )
    @QueryMapping
    fun getUsersInProject(dfe: DataFetchingEnvironment): List<Administrator> {
        val authContext = dfe.requireAuthContext()

        return transaction {
            if (!authContext.admin.mayViewUsersInProject(authContext.projectId)) {
                throw ForbiddenException()
            }
            val administrators = (Administrators leftJoin Regions)
                .select(Administrators.columns)
                .where(Administrators.projectId eq authContext.projectId and not(Administrators.deleted))
                .orderBy(Regions.name to SortOrder.ASC, Administrators.email to SortOrder.ASC)
                .let { AdministratorEntity.wrapRows(it) }
            administrators.map { Administrator.fromDbEntity(it) }
        }
    }

    @GraphQLDescription(
        "Returns all administrators in a region. This query requires the role REGION_ADMIN or PROJECT_ADMIN.",
    )
    @QueryMapping
    fun getUsersInRegion(
        @Argument regionId: Int,
        dfe: DataFetchingEnvironment,
    ): List<Administrator> {
        val authContext = dfe.requireAuthContext()

        return transaction {
            val region = RegionEntity.findById(regionId) ?: throw RegionNotFoundException()
            if (!authContext.admin.mayViewUsersInRegion(region)) {
                throw ForbiddenException()
            }
            val administrators = AdministratorEntity
                .find { Administrators.regionId eq regionId and not(Administrators.deleted) }
                .orderBy(Administrators.email to SortOrder.ASC)

            administrators.map { Administrator.fromDbEntity(it) }
        }
    }
}
