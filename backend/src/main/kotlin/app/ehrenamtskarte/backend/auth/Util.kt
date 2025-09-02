package app.ehrenamtskarte.backend.auth

import app.ehrenamtskarte.backend.db.entities.AdministratorEntity
import app.ehrenamtskarte.backend.db.entities.Administrators
import app.ehrenamtskarte.backend.common.webservice.GraphQLContext
import app.ehrenamtskarte.backend.exception.service.UnauthorizedException
import app.ehrenamtskarte.backend.projects.database.Projects
import org.jetbrains.exposed.sql.transactions.transaction

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
