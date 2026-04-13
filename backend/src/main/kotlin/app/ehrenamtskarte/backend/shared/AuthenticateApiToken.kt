package app.ehrenamtskarte.backend.shared

import app.ehrenamtskarte.backend.db.entities.ApiTokenEntity
import app.ehrenamtskarte.backend.db.entities.ApiTokenType
import app.ehrenamtskarte.backend.db.repositories.ApiTokensRepository
import app.ehrenamtskarte.backend.shared.exceptions.ForbiddenException
import app.ehrenamtskarte.backend.shared.exceptions.UnauthorizedException
import jakarta.servlet.http.HttpServletRequest
import java.security.MessageDigest
import java.time.LocalDate

/**
 * Checks the authentication token against the DB.
 *
 * This function must be called in a transaction.
 */
fun HttpServletRequest.authenticateApiToken(tokenType: ApiTokenType): ApiTokenEntity {
    val tokenHash = getHeader("Authorization")
        ?.takeIf { it.startsWith("Bearer ") }
        ?.removePrefix("Bearer ")
        ?.let { MessageDigest.getInstance("SHA-256").digest(it.toByteArray()) }
        ?: throw UnauthorizedException()

    val apiTokenEntity = ApiTokensRepository.findByTokenHash(tokenHash)
        ?: throw UnauthorizedException()

    return when {
        apiTokenEntity.expirationDate < LocalDate.now() -> throw UnauthorizedException()
        apiTokenEntity.type != tokenType -> throw ForbiddenException()
        else -> apiTokenEntity
    }
}
