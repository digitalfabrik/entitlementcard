package app.ehrenamtskarte.backend.graphql.cards.utils

import app.ehrenamtskarte.backend.db.entities.UserEntitlementsEntity
import app.ehrenamtskarte.backend.db.repositories.CardRepository
import com.eatthepath.otp.TimeBasedOneTimePasswordGenerator
import org.jetbrains.exposed.sql.transactions.transaction
import java.time.Clock
import java.time.Duration
import java.time.Instant
import java.time.LocalDate
import java.time.Month
import java.time.ZoneId
import javax.crypto.spec.SecretKeySpec

val TIME_STEP: Duration = Duration.ofSeconds(30)
const val TOTP_LENGTH = 6

object CardVerifier {
    fun verifyStaticCard(project: String, cardHash: ByteArray, timezone: ZoneId): Boolean {
        val card = transaction { CardRepository.findByHash(project, cardHash) } ?: return false
        return !isExpired(card.expirationDay, timezone) &&
            isYetValid(card.startDay, timezone) &&
            !card.revoked
    }

    fun verifyDynamicCard(project: String, cardHash: ByteArray, totp: Int, timezone: ZoneId): Boolean {
        val card = transaction { CardRepository.findByHash(project, cardHash) } ?: return false
        return !isExpired(card.expirationDay, timezone) &&
            isYetValid(card.startDay, timezone) &&
            !card.revoked &&
            isTotpValid(totp, card.totpSecret)
    }

    fun isExpired(expirationDay: Long?, timezone: ZoneId): Boolean =
        expirationDay != null && !isOnOrBeforeToday(daysSinceEpochToDate(expirationDay), timezone)

    fun isExtendable(project: String, cardHash: ByteArray): Boolean {
        val card = transaction { CardRepository.findByHash(project, cardHash) } ?: return false
        val expirationDay = card.expirationDay ?: return false
        val entitlementId = card.entitlementId ?: return false

        val userEntitlement = transaction { UserEntitlementsEntity.findById(entitlementId) } ?: return false

        return LocalDate.ofEpochDay(expirationDay) < userEntitlement.endDate
    }

    private fun isYetValid(startDay: Long?, timezone: ZoneId): Boolean =
        startDay === null || isOnOrAfterToday(daysSinceEpochToDate(startDay), timezone)

    private fun isTotpValid(totp: Int, secret: ByteArray?): Boolean {
        if (secret == null) return false
        if (generateTotp(secret) == totp) return true

        // current TOTP is invalid, but we are also happy with the previous/next one
        // This means, we tolerate that the device time is shifted by 30s from the server time.
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
            TimeBasedOneTimePasswordGenerator.TOTP_ALGORITHM_HMAC_SHA256,
        )
        val key = SecretKeySpec(secret, totpGenerator.algorithm)
        return totpGenerator.generateOneTimePassword(key, timestamp)
    }
}

fun isOnOrBeforeToday(maxInclusiveDay: LocalDate, clock: Clock): Boolean {
    // Cards issues for day == 0 are never valid!
    if (maxInclusiveDay.isEqual(LocalDate.of(1970, Month.JANUARY, 1))) {
        return false
    }
    // not after includes the current day
    return !LocalDate.now(clock).isAfter(maxInclusiveDay)
}

fun isOnOrBeforeToday(maxInclusiveDay: LocalDate, timezone: ZoneId): Boolean =
    isOnOrBeforeToday(maxInclusiveDay, Clock.system(timezone))

fun daysSinceEpochToDate(days: Long): LocalDate = LocalDate.of(1970, Month.JANUARY, 1).plusDays(days)

fun isOnOrAfterToday(maxInclusiveDay: LocalDate, timezone: ZoneId): Boolean =
    isOnOrAfterToday(maxInclusiveDay, Clock.system(timezone))

fun isOnOrAfterToday(maxInclusiveDay: LocalDate, clock: Clock): Boolean {
    // Cards issues for day == 0 are never valid!
    if (maxInclusiveDay.isEqual(LocalDate.of(1970, Month.JANUARY, 1))) {
        return false
    }
    // not before includes the current day
    return !LocalDate.now(clock).isBefore(maxInclusiveDay)
}
