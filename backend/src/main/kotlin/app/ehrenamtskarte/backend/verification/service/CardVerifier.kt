package app.ehrenamtskarte.backend.verification.service

import com.eatthepath.otp.TimeBasedOneTimePasswordGenerator
import org.jetbrains.exposed.sql.transactions.transaction
import app.ehrenamtskarte.backend.verification.database.repos.CardRepository
import app.ehrenamtskarte.backend.verification.domain.Card
import java.time.Duration
import java.time.Instant
import javax.crypto.KeyGenerator

val TIME_STEP: Duration = Duration.ofMinutes(5)
const val TOTP_LENGTH = 6

object CardVerifier {
    fun verifyCardHash(cardHash: String, totp: Int): Boolean {
        val card = transaction { CardRepository.findByHashModel(cardHash) } ?: return false
        return verifyCard(card, totp)
    }

    fun verifyCard(card: Card, totp: Int): Boolean = !card.hasExpired && isTotpValid(totp, card.totpSecret)

    private fun isTotpValid(totp: Int, secret: ByteArray): Boolean = generateTotp(secret) == totp

    private fun generateTotp(secret: ByteArray, timestamp: Instant = Instant.now()): Int {
        val totpGenerator = TimeBasedOneTimePasswordGenerator(TIME_STEP, TOTP_LENGTH) // TODO add algorithm if we do not use HMAC-SHA1
        val keyGenerator = KeyGenerator.getInstance(totpGenerator.algorithm)
        keyGenerator.init(160) // TODO adapt key length to match HMAC output
        val key = keyGenerator.generateKey()
        return totpGenerator.generateOneTimePassword(key, timestamp)
    }
}
