package app.ehrenamtskarte.backend.auth.webservice

import app.ehrenamtskarte.backend.auth.webservice.schema.types.Administrator
import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import java.time.Instant
import java.time.temporal.ChronoUnit
import java.util.*
import kotlin.NoSuchElementException

object JwtService {
    private val secret by lazy {
        System.getenv("JWT_SECRET")
        ?: throw NoSuchElementException("Environment variable JWT_SECRET not set")
    }
    private val algorithm by lazy { Algorithm.HMAC512(secret) }

    fun create(administrator: Administrator): String =
        JWT.create()
            .withClaim(JwtPayload::email.name, administrator.email)
            .withClaim(JwtPayload::userId.name, administrator.id)
            .withExpiresAt(Date.from(Instant.now().plus(1, ChronoUnit.HOURS)))
            .sign(algorithm)

    fun verify(token: String) = JWT.require(algorithm).build().verify(token).claims.let {
        JwtPayload(it[JwtPayload::email.name]!!.asString(), it[JwtPayload::userId.name]!!.asInt())
    }
}

data class JwtPayload(val email: String, val userId: Int)
