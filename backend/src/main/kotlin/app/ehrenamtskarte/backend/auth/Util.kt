package app.ehrenamtskarte.backend.auth

import app.ehrenamtskarte.backend.auth.database.AdministratorEntity
import app.ehrenamtskarte.backend.common.webservice.GraphQLContext
import app.ehrenamtskarte.backend.exception.service.UnauthorizedException
import org.jetbrains.exposed.sql.transactions.transaction

fun GraphQLContext.getAdministrator(): AdministratorEntity {
    val jwtPayload = this.enforceSignedIn()
    return transaction { AdministratorEntity.findById(jwtPayload.adminId) ?: throw UnauthorizedException() }
}
