package app.ehrenamtskarte.backend.graphql.auth

import app.ehrenamtskarte.backend.db.entities.AdministratorEntity
import app.ehrenamtskarte.backend.db.entities.Administrators
import app.ehrenamtskarte.backend.db.entities.Projects
import app.ehrenamtskarte.backend.shared.exceptions.UnauthorizedException
import com.expediagroup.graphql.generator.extensions.get
import graphql.schema.DataFetchingEnvironment
import org.jetbrains.exposed.sql.transactions.transaction

data class AuthContext(
    val adminId: Int,
    val admin: AdministratorEntity,
    val projectId: Int,
    val project: String,
) {
    companion object {
        /**
         * Creates an AuthContext from a given JWT payload by fetching
         * the administrator and project details from the database.
         * Returns null if the administrator is not found.
         */
        fun fromJwtPayload(payload: JwtPayload): AuthContext? =
            transaction {
                (Administrators innerJoin Projects)
                    .select(Administrators.columns + Projects.columns)
                    .where { Administrators.id eq payload.adminId }
                    .singleOrNull()
                    ?.let {
                        AuthContext(
                            adminId = payload.adminId,
                            admin = AdministratorEntity.wrapRow(it),
                            projectId = it[Projects.id].value,
                            project = it[Projects.project],
                        )
                    }
            }
    }
}

fun DataFetchingEnvironment.requireAuthContext(): AuthContext =
    graphQlContext.get<AuthContext>() ?: throw UnauthorizedException()
