package app.ehrenamtskarte.backend.auth.webservice.schema

import app.ehrenamtskarte.backend.auth.database.AdministratorEntity
import app.ehrenamtskarte.backend.auth.database.Administrators
import app.ehrenamtskarte.backend.auth.service.Authorizer
import app.ehrenamtskarte.backend.auth.webservice.schema.types.Administrator
import app.ehrenamtskarte.backend.common.webservice.GraphQLContext
import app.ehrenamtskarte.backend.common.webservice.UnauthorizedException
import app.ehrenamtskarte.backend.projects.database.ProjectEntity
import app.ehrenamtskarte.backend.projects.database.Projects
import app.ehrenamtskarte.backend.regions.database.RegionEntity
import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import graphql.schema.DataFetchingEnvironment
import org.jetbrains.exposed.sql.and
import org.jetbrains.exposed.sql.not
import org.jetbrains.exposed.sql.transactions.transaction

@Suppress("unused")
class ViewAdministratorsQueryService {

    @GraphQLDescription("Returns the requesting administrator as retrieved from his JWT token.")
    fun whoAmI(project: String, dfe: DataFetchingEnvironment): Administrator {
        val context = dfe.getContext<GraphQLContext>()
        val jwtPayload = context.enforceSignedIn()

        return transaction {
            val admin = AdministratorEntity.findById(jwtPayload.adminId)
            val projectId = ProjectEntity.find { Projects.project eq project }.single().id
            if (admin == null || admin.deleted || admin.projectId != projectId) {
                throw UnauthorizedException()
            }
            Administrator.fromDbEntity(admin)
        }
    }

    @GraphQLDescription("Returns all administrators in a project. This query requires the role PROJECT_ADMIN.")
    fun getUsersInProject(
        project: String,
        dfe: DataFetchingEnvironment
    ): List<Administrator> {
        val context = dfe.getContext<GraphQLContext>()
        val jwtPayload = context.enforceSignedIn()

        return transaction {
            val admin = AdministratorEntity.findById(jwtPayload.adminId)
            val projectId = ProjectEntity.find { Projects.project eq project }.single().id.value
            if (!Authorizer.mayViewUsersInProject(admin, projectId)) {
                throw UnauthorizedException()
            }
            val administrators =
                AdministratorEntity.find { Administrators.projectId eq projectId and not(Administrators.deleted) }

            administrators.map { Administrator.fromDbEntity(it) }
        }
    }

    @GraphQLDescription("Returns all administrators in a region. This query requires the role REGION_ADMIN or PROJECT_ADMIN.")
    fun getUsersInRegion(
        regionId: Int,
        dfe: DataFetchingEnvironment
    ): List<Administrator> {
        val context = dfe.getContext<GraphQLContext>()
        val jwtPayload = context.enforceSignedIn()

        return transaction {
            val admin = AdministratorEntity.findById(jwtPayload.adminId)
            val region = RegionEntity.findById(regionId) ?: throw UnauthorizedException()
            if (!Authorizer.mayViewUsersInRegion(admin, region)) {
                throw UnauthorizedException()
            }
            val administrators =
                AdministratorEntity.find { Administrators.regionId eq regionId and not(Administrators.deleted) }

            administrators.map { Administrator.fromDbEntity(it) }
        }
    }
}
