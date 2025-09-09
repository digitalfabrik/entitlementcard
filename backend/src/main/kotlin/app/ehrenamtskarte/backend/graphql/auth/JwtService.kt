package app.ehrenamtskarte.backend.graphql.auth

import app.ehrenamtskarte.backend.shared.exceptions.UnauthorizedException
import app.ehrenamtskarte.backend.graphql.auth.schema.types.Administrator
import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import io.javalin.http.Context
import java.io.File
import java.time.Instant
import java.time.temporal.ChronoUnit
import java.util.Date

object JwtService {
    private val secret by lazy {
        System.getenv("JWT_SECRET")
            ?: readJwtSecretFile(System.getenv("JWT_SECRET_FILE"))
            ?: throw UnauthorizedException()
    }
    private val algorithm by lazy { Algorithm.HMAC512(secret) }

    fun createToken(administrator: Administrator): String =
        JWT.create()
            .withClaim(JwtPayload::adminId.name, administrator.id)
            .withExpiresAt(Date.from(Instant.now().plus(1, ChronoUnit.HOURS)))
            .sign(algorithm)

    private fun readJwtSecretFile(fileName: String?): String? {
        if (fileName == null) {
            return null
        }

        return File(fileName).readText(Charsets.UTF_8)
    }

    private fun verifyToken(token: String) =
        JWT.require(algorithm)
            .build()
            .verify(token).claims.let {
                JwtPayload(it[JwtPayload::adminId.name]!!.asInt())
            }

    fun verifyRequest(context: Context): JwtPayload? {
        val header = context.header("Authorization") ?: return null
        val split = header.split(" ")
        val jwtToken = (if (split.size != 2 || split[0] != "Bearer") null else split[1]) ?: return null

        return verifyToken(jwtToken)
    }
}

data class JwtPayload(val adminId: Int)
