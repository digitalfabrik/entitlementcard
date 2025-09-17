package app.ehrenamtskarte.backend.shared

import app.ehrenamtskarte.backend.db.entities.ApiTokenEntity
import app.ehrenamtskarte.backend.db.entities.ApiTokenType
import app.ehrenamtskarte.backend.db.repositories.ApiTokensRepository
import app.ehrenamtskarte.backend.shared.crypto.PasswordCrypto
import app.ehrenamtskarte.backend.shared.exceptions.ForbiddenException
import app.ehrenamtskarte.backend.shared.exceptions.UnauthorizedException
import jakarta.servlet.http.HttpServletRequest
import org.jetbrains.exposed.sql.transactions.transaction
import java.time.LocalDate

// todo: this should be removed or refactored after #2452
object TokenAuthenticator {
    private const val BEARER_PREFIX = "Bearer "

    private fun authenticateToken(header: String?, neededType: ApiTokenType): ApiTokenEntity {
        val tokenValue = header
            ?.takeIf { it.startsWith(BEARER_PREFIX) }
            ?.removePrefix(BEARER_PREFIX)
            ?: throw UnauthorizedException()

        val tokenHash = PasswordCrypto.hashWithSHA256(tokenValue.toByteArray())

        val tokenEntity = transaction { ApiTokensRepository.findByTokenHash(tokenHash) }
            ?: throw UnauthorizedException()

        if (tokenEntity.expirationDate <= LocalDate.now()) {
            throw UnauthorizedException()
        }

        if (tokenEntity.type != neededType) {
            throw ForbiddenException()
        }

        return tokenEntity
    }

    fun authenticate(request: HttpServletRequest, neededType: ApiTokenType): ApiTokenEntity =
        authenticateToken(request.getHeader("Authorization"), neededType)
}
