package app.ehrenamtskarte.backend.verification.service

import app.ehrenamtskarte.backend.verification.ValidityPeriodUtil.Companion.daysSinceEpochToDate
import app.ehrenamtskarte.backend.verification.ValidityPeriodUtil.Companion.isOnOrBeforeToday
import app.ehrenamtskarte.backend.verification.database.CardEntity
import app.ehrenamtskarte.backend.verification.database.repos.CardRepository
import com.eatthepath.otp.TimeBasedOneTimePasswordGenerator
import org.jetbrains.exposed.sql.transactions.transaction
import java.time.Duration
import java.time.Instant
import java.time.ZoneId
import javax.crypto.spec.SecretKeySpec

val TIME_STEP: Duration = Duration.ofSeconds(30)
const val TOTP_LENGTH = 6

object CardVerifier {
    fun verifyCardHash(project: String, cardHash: ByteArray, totp: Int?, timezone: ZoneId): Boolean {
        val card = transaction { CardRepository.findByHashModel(project, cardHash) } ?: return false
        return if (totp != null) verifyCard(card, totp, timezone) else verifyStaticCard(card, timezone)
    }

    private fun verifyStaticCard(card: CardEntity, timezone: ZoneId): Boolean {
        return !isExpired(card.expirationDay, timezone) &&
            !card.revoked
    }

    private fun verifyCard(card: CardEntity, totp: Int, timezone: ZoneId): Boolean {
        return !isExpired(card.expirationDay, timezone) &&
            !card.revoked &&
            isTotpValid(totp, card.totpSecret)
    }

    private fun isExpired(expirationDay: Long?, timezone: ZoneId): Boolean {
        return expirationDay != null && !isOnOrBeforeToday(daysSinceEpochToDate(expirationDay), timezone)
    }

    private fun isTotpValid(totp: Int, secret: ByteArray?): Boolean {
        if (secret == null) return false
        if (generateTotp(secret) == totp) return true

        // current TOTP is invalid, but we are also happy with the previous/next one
        val previousValidTotp = generateTotp(secret, Instant.now().minus(TIME_STEP))
        if (previousValidTotp == totp) return true
        val nextValidTotp = generateTotp(secret, Instant.now().plus(TIME_STEP))
        if (nextValidTotp == totp) return true

        return false
    }

    private fun generateTotp(secret: ByteArray, timestamp: Instant = Instant.now()): Int {
        val totpGenerator = TimeBasedOneTimePasswordGenerator(
            TIME_STEP,
            TOTP_LENGTH,
            TimeBasedOneTimePasswordGenerator.TOTP_ALGORITHM_HMAC_SHA256
        )
        val key = SecretKeySpec(secret, totpGenerator.algorithm)
        return totpGenerator.generateOneTimePassword(key, timestamp)
    }
}
