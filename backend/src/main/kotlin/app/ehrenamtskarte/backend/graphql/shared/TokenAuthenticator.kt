package app.ehrenamtskarte.backend.graphql.shared

import app.ehrenamtskarte.backend.db.entities.ApiTokenEntity
import app.ehrenamtskarte.backend.db.entities.ApiTokenType
import app.ehrenamtskarte.backend.db.repositories.ApiTokensRepository
import app.ehrenamtskarte.backend.shared.crypto.PasswordCrypto
import app.ehrenamtskarte.backend.shared.exceptions.ForbiddenException
import app.ehrenamtskarte.backend.shared.exceptions.UnauthorizedException
import io.javalin.http.Context
import jakarta.servlet.http.HttpServletRequest
import org.jetbrains.exposed.sql.transactions.transaction
import java.time.LocalDate

object TokenAuthenticator {
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
