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

// todo: this will be removed or refactored after #2452
object TokenAuthenticator {
    private fun authenticateToken(header: String?, neededType: ApiTokenType): ApiTokenEntity {
        val token = header
            ?.takeIf { it.startsWith("Bearer ") }
            ?.removePrefix("Bearer ")
            ?: throw UnauthorizedException()

        val tokenHash = PasswordCrypto.hashWithSHA256(token.toByteArray())

        return transaction {
            val apiToken = ApiTokensRepository.findByTokenHash(tokenHash)
                ?.takeIf { it.expirationDate > LocalDate.now() }
                ?: throw UnauthorizedException()

            if (apiToken.type != neededType) throw ForbiddenException()

            apiToken
        }
    }

    fun authenticate(request: HttpServletRequest, neededType: ApiTokenType): ApiTokenEntity =
        authenticateToken(request.getHeader("Authorization"), neededType)
}
