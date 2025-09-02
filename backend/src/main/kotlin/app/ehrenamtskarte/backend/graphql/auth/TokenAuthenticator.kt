package app.ehrenamtskarte.backend.graphql.auth

import app.ehrenamtskarte.backend.db.entities.ApiTokenEntity
import app.ehrenamtskarte.backend.db.entities.ApiTokenType
import app.ehrenamtskarte.backend.auth.database.PasswordCrypto
import app.ehrenamtskarte.backend.db.repositories.ApiTokensRepository
import app.ehrenamtskarte.backend.exception.service.ForbiddenException
import app.ehrenamtskarte.backend.exception.service.UnauthorizedException
import io.javalin.http.Context
import jakarta.servlet.http.HttpServletRequest
import org.jetbrains.exposed.sql.transactions.transaction
import java.time.LocalDate

class TokenAuthenticator {
    companion object TokenAuthenticator {
        private fun authenticateToken(header: String?, neededType: ApiTokenType): ApiTokenEntity {
            val authHeader = header?.takeIf { it.startsWith("Bearer ") }
                ?: throw UnauthorizedException()

            val tokenHash = PasswordCrypto.hashWithSHA256(authHeader.substring(7).toByteArray())

            return transaction {
                ApiTokensRepository.findByTokenHash(tokenHash)
                    ?.takeIf { it.expirationDate > LocalDate.now() && it.type == neededType }
                    ?: throw ForbiddenException()
            }
        }

        fun authenticate(context: Context, neededType: ApiTokenType): ApiTokenEntity =
            authenticateToken(context.header("Authorization"), neededType)

        fun authenticate(request: HttpServletRequest, neededType: ApiTokenType): ApiTokenEntity =
            authenticateToken(request.getHeader("Authorization"), neededType)
    }
}
