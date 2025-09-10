package app.ehrenamtskarte.backend.graphql.auth

import app.ehrenamtskarte.backend.db.entities.AdministratorEntity
import app.ehrenamtskarte.backend.db.entities.Administrators
import app.ehrenamtskarte.backend.db.entities.RegionEntity
import app.ehrenamtskarte.backend.db.entities.Regions
import app.ehrenamtskarte.backend.db.entities.mayViewUsersInProject
import app.ehrenamtskarte.backend.db.entities.mayViewUsersInRegion
import app.ehrenamtskarte.backend.graphql.auth.types.Administrator
import app.ehrenamtskarte.backend.graphql.context
import app.ehrenamtskarte.backend.graphql.getAuthContext
import app.ehrenamtskarte.backend.graphql.shared.exceptions.RegionNotFoundException
import app.ehrenamtskarte.backend.shared.exceptions.ForbiddenException
import app.ehrenamtskarte.backend.shared.exceptions.UnauthorizedException
import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import graphql.schema.DataFetchingEnvironment
import org.jetbrains.exposed.sql.SortOrder
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.and
import org.jetbrains.exposed.sql.not
import org.jetbrains.exposed.sql.transactions.transaction

@Suppress("unused")
class ViewAdministratorsQueryService {
    @GraphQLDescription("Returns the requesting administrator as retrieved from his JWT token.")
    fun whoAmI(dfe: DataFetchingEnvironment): Administrator {
        val context = dfe.graphQlContext.context
        val admin = context.getAuthContext().admin

        return transaction {
            if (admin.deleted) {
                throw UnauthorizedException()
            }
            Administrator.fromDbEntity(admin)
        }
    }

    @GraphQLDescription(
        "Returns all administrators in a project. This query requires the role PROJECT_ADMIN.",
    )
    fun getUsersInProject(dfe: DataFetchingEnvironment): List<Administrator> {
        val context = dfe.graphQlContext.context
        val authContext = context.getAuthContext()

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
    fun getUsersInRegion(regionId: Int, dfe: DataFetchingEnvironment): List<Administrator> {
        val context = dfe.graphQlContext.context
        val admin = context.getAuthContext().admin

        return transaction {
            val region = RegionEntity.findById(regionId) ?: throw RegionNotFoundException()
            if (!admin.mayViewUsersInRegion(region)) {
                throw ForbiddenException()
            }
            val administrators = AdministratorEntity
                .find { Administrators.regionId eq regionId and not(Administrators.deleted) }
                .orderBy(Administrators.email to SortOrder.ASC)

            administrators.map { Administrator.fromDbEntity(it) }
        }
    }
}
