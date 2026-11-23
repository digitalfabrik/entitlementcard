package app.ehrenamtskarte.backend.graphql.auth

import app.ehrenamtskarte.backend.db.entities.AdministratorEntity
import app.ehrenamtskarte.backend.db.entities.Projects
import app.ehrenamtskarte.backend.shared.exceptions.ForbiddenException
import app.ehrenamtskarte.backend.shared.exceptions.UnauthorizedException
import com.expediagroup.graphql.generator.extensions.get
import graphql.schema.DataFetchingEnvironment
import org.jetbrains.exposed.v1.core.dao.id.EntityID
import org.jetbrains.exposed.v1.jdbc.transactions.transaction

/**
 * Context of an authenticated administrator acting within their own project.
 * Only exists for administrators that are bound to a project (i.e. not for PROJECT_CREATOR).
 */
data class ProjectAuthContext(
    val adminId: Int,
    val admin: AdministratorEntity,
    val projectId: Int,
    val project: String,
) {
    val projectEntityId: EntityID<Int>
        get() = EntityID(projectId, Projects)

    companion object {
        /**
         * Creates a ProjectAuthContext for the administrator of the given [AuthContext].
         * Returns null if the administrator is not bound to a project.
         */
        fun fromAuthContext(authContext: AuthContext): ProjectAuthContext? =
            transaction {
                val admin = authContext.admin
                admin.project?.let {
                    ProjectAuthContext(
                        adminId = admin.id.value,
                        admin = admin,
                        projectId = it.id.value,
                        project = it.project,
                    )
                }
            }
    }
}

/**
 * Returns the context of the authenticated administrator acting within their own project.
 * Throws an [UnauthorizedException] if the request is not authenticated and a [ForbiddenException]
 * if the administrator is not bound to a project (e.g. PROJECT_CREATOR).
 */
fun DataFetchingEnvironment.requireProjectAuthContext(): ProjectAuthContext {
    graphQlContext.get<ProjectAuthContext>()?.let { return it }
    requireAuthContext()
    throw ForbiddenException()
}
