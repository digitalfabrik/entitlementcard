package app.ehrenamtskarte.backend.graphql.auth

// import app.ehrenamtskarte.backend.graphql.auth.types.Administrator
import app.ehrenamtskarte.backend.shared.exceptions.UnauthorizedException
import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import com.auth0.jwt.exceptions.JWTVerificationException
import org.springframework.graphql.server.WebGraphQlRequest
import java.io.File
// import java.time.Instant
// import java.time.temporal.ChronoUnit
// import java.util.Date

object JwtService {
    private val secret by lazy {
        System.getenv("JWT_SECRET")
            ?: readJwtSecretFile(System.getenv("JWT_SECRET_FILE"))
            ?: throw UnauthorizedException()
    }
    private val algorithm by lazy { Algorithm.HMAC512(secret) }

    // fun createToken(administrator: Administrator): String =
    //    JWT.create()
    //        .withClaim(JwtPayload::adminId.name, administrator.id)
    //        .withExpiresAt(Date.from(Instant.now().plus(1, ChronoUnit.HOURS)))
    //        .sign(algorithm)

    /**
     * Verifies the Authorization header and returns a [JwtPayload] if successful.
     * It expects a "Bearer <token>" format.
     * Returns null if the header is malformed or the token is invalid.
     */
    fun verifyRequest(request: WebGraphQlRequest): JwtPayload? {
        val authHeader = request.headers.getFirst("Authorization") ?: return null
        val split = authHeader.split(" ")
        val jwtToken = (if (split.size != 2 || split[0] != "Bearer") null else split[1]) ?: return null

        return try {
            verifyToken(jwtToken)
        } catch (_: JWTVerificationException) {
            null
        }
    }

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
}

data class JwtPayload(val adminId: Int)
