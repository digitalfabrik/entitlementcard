package app.ehrenamtskarte.backend.graphql

import app.ehrenamtskarte.backend.graphql.shared.GraphQLContext
import app.ehrenamtskarte.backend.db.entities.AdministratorEntity
import app.ehrenamtskarte.backend.db.entities.Administrators
import app.ehrenamtskarte.backend.db.entities.Projects
import app.ehrenamtskarte.backend.shared.exceptions.UnauthorizedException
import org.jetbrains.exposed.sql.transactions.transaction

data class AuthContext(
    val adminId: Int,
    val admin: AdministratorEntity,
    val projectId: Int,
    val project: String,
)

fun GraphQLContext.getAuthContext(): AuthContext {
    val jwtPayload = this.enforceSignedIn()
    return transaction {
        (Administrators innerJoin Projects)
            .select(Administrators.columns + Projects.columns)
            .where { Administrators.id eq jwtPayload.adminId }
            .singleOrNull()
            ?.let {
                AuthContext(
                    adminId = jwtPayload.adminId,
                    admin = AdministratorEntity.wrapRow(it),
                    projectId = it[Projects.id].value,
                    project = it[Projects.project],
                )
            } ?: throw UnauthorizedException()
    }
}
