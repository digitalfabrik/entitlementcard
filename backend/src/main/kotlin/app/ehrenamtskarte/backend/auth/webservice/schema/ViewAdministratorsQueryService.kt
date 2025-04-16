package app.ehrenamtskarte.backend.auth.webservice.schema

import app.ehrenamtskarte.backend.auth.database.AdministratorEntity
import app.ehrenamtskarte.backend.auth.database.Administrators
import app.ehrenamtskarte.backend.auth.getAdministrator
import app.ehrenamtskarte.backend.auth.service.Authorizer
import app.ehrenamtskarte.backend.auth.webservice.schema.types.Administrator
import app.ehrenamtskarte.backend.common.webservice.GraphQLContext
import app.ehrenamtskarte.backend.exception.service.ForbiddenException
import app.ehrenamtskarte.backend.exception.service.ProjectNotFoundException
import app.ehrenamtskarte.backend.exception.service.UnauthorizedException
import app.ehrenamtskarte.backend.exception.webservice.exceptions.RegionNotFoundException
import app.ehrenamtskarte.backend.projects.database.ProjectEntity
import app.ehrenamtskarte.backend.projects.database.Projects
import app.ehrenamtskarte.backend.regions.database.RegionEntity
import app.ehrenamtskarte.backend.regions.database.Regions
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
    fun whoAmI(project: String, dfe: DataFetchingEnvironment): Administrator {
        val context = dfe.getContext<GraphQLContext>()
        val admin = context.getAdministrator()

        return transaction {
            val projectEntity = ProjectEntity.find { Projects.project eq project }.firstOrNull()
                ?: throw ProjectNotFoundException(project)
            if (admin.deleted || admin.projectId != projectEntity.id) {
                throw UnauthorizedException()
            }
            Administrator.fromDbEntity(admin)
        }
    }

    @GraphQLDescription(
        "Returns all administrators in a project. This query requires the role PROJECT_ADMIN.",
    )
    fun getUsersInProject(project: String, dfe: DataFetchingEnvironment): List<Administrator> {
        val context = dfe.getContext<GraphQLContext>()
        val admin = context.getAdministrator()

        return transaction {
            val projectEntity = ProjectEntity.find { Projects.project eq project }.firstOrNull()
                ?: throw ProjectNotFoundException(project)
            val projectId = projectEntity.id.value
            if (!Authorizer.mayViewUsersInProject(admin, projectId)) {
                throw ForbiddenException()
            }
            val administrators = (Administrators leftJoin Regions)
                .select(Administrators.columns)
                .where(Administrators.projectId eq projectId and not(Administrators.deleted))
                .orderBy(Regions.name to SortOrder.ASC, Administrators.email to SortOrder.ASC)
                .let { AdministratorEntity.wrapRows(it) }
            administrators.map { Administrator.fromDbEntity(it) }
        }
    }

    @GraphQLDescription(
        "Returns all administrators in a region. This query requires the role REGION_ADMIN or PROJECT_ADMIN.",
    )
    fun getUsersInRegion(regionId: Int, dfe: DataFetchingEnvironment): List<Administrator> {
        val context = dfe.getContext<GraphQLContext>()
        val admin = context.getAdministrator()

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
