package app.ehrenamtskarte.backend.auth.webservice.schema

import app.ehrenamtskarte.backend.auth.database.AdministratorEntity
import app.ehrenamtskarte.backend.auth.database.Administrators
import app.ehrenamtskarte.backend.auth.service.Authorizer
import app.ehrenamtskarte.backend.auth.webservice.schema.types.Administrator
import app.ehrenamtskarte.backend.auth.webservice.schema.types.Role
import app.ehrenamtskarte.backend.common.webservice.GraphQLContext
import app.ehrenamtskarte.backend.common.webservice.UnauthorizedException
import app.ehrenamtskarte.backend.projects.database.ProjectEntity
import app.ehrenamtskarte.backend.projects.database.Projects
import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import graphql.schema.DataFetchingEnvironment
import org.jetbrains.exposed.sql.transactions.transaction

@Suppress("unused")
class ViewAdministratorsQueryService {

    @GraphQLDescription("Returns all administrators in a project. This function requires the role PROJECT_ADMIN.")
    fun getUsersInProject(
        project: String,
        dfe: DataFetchingEnvironment
    ): List<Administrator> {
        val context = dfe.getContext<GraphQLContext>()
        val jwtPayload = context.enforceSignedIn()

        return transaction {
            val user = AdministratorEntity.findById(jwtPayload.userId)
            val projectId = ProjectEntity.find { Projects.project eq project }.single().id.value
            if (!Authorizer.mayViewUsersInProject(user, projectId)) {
                throw UnauthorizedException()
            }
            val administrators = AdministratorEntity.find { Administrators.projectId eq projectId }

            administrators.map {
                Administrator(
                    it.id.value,
                    it.email,
                    it.regionId?.value,
                    Role.fromDbValue(it.role)!!
                )
            }
        }
    }
}
