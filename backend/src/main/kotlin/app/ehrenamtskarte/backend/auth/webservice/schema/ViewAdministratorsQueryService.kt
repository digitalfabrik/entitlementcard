package app.ehrenamtskarte.backend.auth.webservice.schema

import app.ehrenamtskarte.backend.db.entities.AdministratorEntity
import app.ehrenamtskarte.backend.db.entities.Administrators
import app.ehrenamtskarte.backend.graphql.getAuthContext
import app.ehrenamtskarte.backend.auth.service.Authorizer
import app.ehrenamtskarte.backend.auth.webservice.schema.types.Administrator
import app.ehrenamtskarte.backend.common.webservice.context
import app.ehrenamtskarte.backend.exception.service.ForbiddenException
import app.ehrenamtskarte.backend.exception.service.UnauthorizedException
import app.ehrenamtskarte.backend.exception.webservice.exceptions.RegionNotFoundException
import app.ehrenamtskarte.backend.db.entities.RegionEntity
import app.ehrenamtskarte.backend.db.entities.Regions
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
            if (!Authorizer.mayViewUsersInProject(authContext.admin, authContext.projectId)) {
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
            if (!Authorizer.mayViewUsersInRegion(admin, region)) {
                throw ForbiddenException()
            }
            val administrators = AdministratorEntity
                .find { Administrators.regionId eq regionId and not(Administrators.deleted) }
                .orderBy(Administrators.email to SortOrder.ASC)

            administrators.map { Administrator.fromDbEntity(it) }
        }
    }
}
