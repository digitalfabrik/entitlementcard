package app.ehrenamtskarte.backend.graphql.auth

import app.ehrenamtskarte.backend.db.entities.AdministratorEntity
import app.ehrenamtskarte.backend.db.entities.Administrators
import app.ehrenamtskarte.backend.db.entities.Projects
import app.ehrenamtskarte.backend.shared.exceptions.UnauthorizedException
import jakarta.servlet.http.HttpServletRequest
import org.jetbrains.exposed.sql.transactions.transaction

data class AuthContext(
    val adminId: Int,
    val admin: AdministratorEntity,
    val projectId: Int,
    val project: String,
)

fun HttpServletRequest.getAuthContext(): AuthContext {
    val jwtPayload = JwtService.verifyRequest(this) ?: throw UnauthorizedException()
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
