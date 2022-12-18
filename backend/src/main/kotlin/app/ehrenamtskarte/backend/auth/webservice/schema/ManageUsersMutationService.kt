package app.ehrenamtskarte.backend.auth.webservice.schema

import app.ehrenamtskarte.backend.auth.database.AdministratorEntity
import app.ehrenamtskarte.backend.auth.database.repos.AdministratorsRepository
import app.ehrenamtskarte.backend.auth.service.Authorizer
import app.ehrenamtskarte.backend.auth.webservice.schema.types.Role
import app.ehrenamtskarte.backend.common.webservice.GraphQLContext
import app.ehrenamtskarte.backend.common.webservice.UnauthorizedException
import app.ehrenamtskarte.backend.projects.database.ProjectEntity
import app.ehrenamtskarte.backend.projects.database.Projects
import app.ehrenamtskarte.backend.regions.database.RegionEntity
import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import graphql.schema.DataFetchingEnvironment
import org.jetbrains.exposed.sql.transactions.transaction

@Suppress("unused")
class ManageUsersMutationService {

    @GraphQLDescription("Creates a new administrator")
    fun createAdministrator(
        project: String,
        email: String,
        role: Role,
        regionId: Int?,
        dfe: DataFetchingEnvironment
    ): Boolean {
        val context = dfe.getContext<GraphQLContext>()
        val jwtPayload = context.enforceSignedIn()
        transaction {
            val actingAdmin = AdministratorEntity.findById(jwtPayload.userId) ?: throw UnauthorizedException()

            val projectEntity = ProjectEntity.find { Projects.project eq project }.first()
            val region = regionId?.let { RegionEntity.findById(it) }

            if (!Authorizer.mayCreateAdministrator(actingAdmin, projectEntity.id.value, role, region)) {
                throw UnauthorizedException()
            }

            AdministratorsRepository.insert(project, email, null, role, regionId)
        }
        return true
    }
}
