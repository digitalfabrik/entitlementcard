package app.ehrenamtskarte.backend.verification.service

import app.ehrenamtskarte.backend.verification.database.repos.CardRepository
import app.ehrenamtskarte.backend.verification.domain.Card
import com.eatthepath.otp.TimeBasedOneTimePasswordGenerator
import org.jetbrains.exposed.sql.transactions.transaction
import java.time.Duration
import java.time.Instant
import javax.crypto.spec.SecretKeySpec

val TIME_STEP: Duration = Duration.ofSeconds(30)
const val TOTP_LENGTH = 10

@ExperimentalUnsignedTypes
object CardVerifier {
    fun verifyCardHash(cardHash: String, totp: Int): Boolean {
        val card = transaction { CardRepository.findByHashModel(cardHash) } ?: return false
        return verifyCard(card, totp)
    }

    private fun verifyCard(card: Card, totp: Int): Boolean = !card.hasExpired && isTotpValid(totp, card.totpSecret.toByteArray())

    private fun isTotpValid(totp: Int, secret: ByteArray): Boolean {
        if (generateTotp(secret) == totp) return true

        // current TOTP is invalid, but we are also happy with the previous/next one
        val previousValidTotp = generateTotp(secret, Instant.now().minus(TIME_STEP))
        if (previousValidTotp == totp) return true
        val nextValidTotp = generateTotp(secret, Instant.now().plus(TIME_STEP))
        if (nextValidTotp == totp) return true

        return false
    }

    private fun generateTotp(secret: ByteArray, timestamp: Instant = Instant.now()): Int {
        val totpGenerator = TimeBasedOneTimePasswordGenerator(TIME_STEP, TOTP_LENGTH,
            TimeBasedOneTimePasswordGenerator.TOTP_ALGORITHM_HMAC_SHA256)
        val key = SecretKeySpec(secret, totpGenerator.algorithm)
        return totpGenerator.generateOneTimePassword(key, timestamp)
    }
}
