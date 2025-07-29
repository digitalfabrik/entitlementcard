package app.ehrenamtskarte.backend.auth

import app.ehrenamtskarte.backend.auth.database.AdministratorEntity
import app.ehrenamtskarte.backend.auth.database.Administrators
import app.ehrenamtskarte.backend.common.webservice.GraphQLContext
import app.ehrenamtskarte.backend.exception.service.UnauthorizedException
import org.jetbrains.exposed.dao.with
import org.jetbrains.exposed.sql.transactions.transaction

fun GraphQLContext.getAuthContext(): AuthContext {
    val jwtPayload = this.enforceSignedIn()
    return transaction {
        val adminEntity = AdministratorEntity.find { Administrators.id eq jwtPayload.adminId }
            .with(AdministratorEntity::project)
            .singleOrNull() ?: throw UnauthorizedException()
        AuthContext(
            adminId = jwtPayload.adminId,
            admin = adminEntity,
            projectId = adminEntity.projectId.value,
            project = adminEntity.projectName,
        )
    }
}
