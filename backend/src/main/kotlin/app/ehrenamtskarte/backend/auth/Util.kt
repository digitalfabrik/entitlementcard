package app.ehrenamtskarte.backend.auth

import app.ehrenamtskarte.backend.auth.database.AdministratorEntity
import app.ehrenamtskarte.backend.auth.database.Administrators
import app.ehrenamtskarte.backend.common.webservice.GraphQLContext
import app.ehrenamtskarte.backend.exception.service.UnauthorizedException
import app.ehrenamtskarte.backend.projects.database.Projects
import org.jetbrains.exposed.sql.transactions.transaction

fun GraphQLContext.getAuthContext(): AuthContext {
    val jwtPayload = this.enforceSignedIn()
    return transaction {
        val row = (Administrators innerJoin Projects)
            .select(Administrators.columns + Projects.columns)
            .where { Administrators.id eq jwtPayload.adminId }
            .singleOrNull() ?: throw UnauthorizedException()
        AuthContext(
            adminId = jwtPayload.adminId,
            admin = AdministratorEntity.wrapRow(row),
            projectId = row[Projects.id].value,
            project = row[Projects.project],
        )
    }
}
