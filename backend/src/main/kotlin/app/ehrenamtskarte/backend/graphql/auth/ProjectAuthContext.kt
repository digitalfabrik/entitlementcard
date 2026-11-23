package app.ehrenamtskarte.backend.graphql.auth

import app.ehrenamtskarte.backend.db.entities.AdministratorEntity
import app.ehrenamtskarte.backend.db.entities.Administrators
import app.ehrenamtskarte.backend.db.entities.Projects
import app.ehrenamtskarte.backend.shared.exceptions.UnauthorizedException
import com.expediagroup.graphql.generator.extensions.get
import graphql.schema.DataFetchingEnvironment
import org.jetbrains.exposed.v1.core.dao.id.EntityID
import org.jetbrains.exposed.v1.core.eq
import org.jetbrains.exposed.v1.jdbc.select
import org.jetbrains.exposed.v1.jdbc.transactions.transaction

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
         * Creates a ProjectAuthContext from a given JWT payload by fetching
         * the administrator and project details from the database.
         * Returns null if the administrator is not found.
         */
        fun fromJwtPayload(payload: JwtPayload): ProjectAuthContext? =
            transaction {
                (Administrators innerJoin Projects)
                    .select(Administrators.columns + Projects.columns)
                    .where { Administrators.id eq payload.adminId }
                    .singleOrNull()
                    ?.let {
                        ProjectAuthContext(
                            adminId = payload.adminId,
                            admin = AdministratorEntity.wrapRow(it),
                            projectId = it[Projects.id].value,
                            project = it[Projects.project],
                        )
                    }
            }
    }
}

fun DataFetchingEnvironment.requireProjectAuthContext(): ProjectAuthContext =
    graphQlContext.get<ProjectAuthContext>() ?: throw UnauthorizedException()
