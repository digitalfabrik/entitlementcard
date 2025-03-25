package app.ehrenamtskarte.backend.cards

import org.junit.jupiter.api.Test
import java.time.Clock
import java.time.LocalDateTime
import java.time.ZoneId
import java.time.ZoneOffset
import java.time.ZonedDateTime
import kotlin.test.assertEquals
import kotlin.test.assertFalse
import kotlin.test.assertTrue

internal class ValidityPeriodUtilTest {
    private fun clockWithTime(
        year: Int,
        month: Int,
        dayOfMonth: Int,
        hour: Int,
        minute: Int,
    ): Clock =
        Clock.fixed(
            // Europe/Berlin == +1 Offset
            LocalDateTime.of(year, month, dayOfMonth, hour, minute).toInstant(ZoneOffset.ofHours(1)),
            ZoneId.of("Europe/Berlin"),
        )

    @Test
    fun epochWithEpochExpiration() {
        // On 1970-01-01 no card is valid. We exclude this day because it corresponds to day == 0.

        val clock = clockWithTime(1970, 1, 1, 0, 0)
        assertFalse(ValidityPeriodUtil.isOnOrBeforeToday(ValidityPeriodUtil.daysSinceEpochToDate(0L), clock))
    }

    @Test
    fun threeDaysAfterEpochWithLaterExpiration() {
        val clock = clockWithTime(1970, 1, 7, 0, 0)
        assertFalse(ValidityPeriodUtil.isOnOrBeforeToday(ValidityPeriodUtil.daysSinceEpochToDate(5L), clock))
    }

    @Test
    fun sameDays() {
        val clock = clockWithTime(1970, 1, 6, 0, 0)
        assertTrue(ValidityPeriodUtil.isOnOrBeforeToday(ValidityPeriodUtil.daysSinceEpochToDate(5L), clock))
    }

    @Test
    fun oneDayAfterEpochWithLaterExpiration() {
        val clock = clockWithTime(1970, 1, 2, 0, 0)
        assertTrue(ValidityPeriodUtil.isOnOrBeforeToday(ValidityPeriodUtil.daysSinceEpochToDate(5L), clock))
    }

    @Test
    fun twoDaysBeforeEpochWithLaterExpiration() {
        val clock = clockWithTime(1969, 12, 29, 0, 0)
        assertTrue(ValidityPeriodUtil.isOnOrBeforeToday(ValidityPeriodUtil.daysSinceEpochToDate(1L), clock))
    }

    @Test
    fun beforeMidnight() {
        val clock = clockWithTime(1970, 1, 6, 23, 30)
        assertTrue(ValidityPeriodUtil.isOnOrBeforeToday(ValidityPeriodUtil.daysSinceEpochToDate(5L), clock))
    }

    @Test
    fun afterMidnight() {
        val clock = clockWithTime(1970, 1, 7, 0, 30)
        assertFalse(ValidityPeriodUtil.isOnOrBeforeToday(ValidityPeriodUtil.daysSinceEpochToDate(5L), clock))
    }

    @Test
    fun randomDayIsConformantWithAdministrationFrontend() {
        // Values taken from administration frontend
        val clock = clockWithTime(2080, 12, 7, 15, 30)
        assertTrue(ValidityPeriodUtil.isOnOrBeforeToday(ValidityPeriodUtil.daysSinceEpochToDate(40518), clock))
    }

    @Test
    fun randomDay() {
        // 30304 was defined in DayUtilTest.kt
        // "2052, 12, 20" was calculated here and is copied to day.test.ts
        val clock = clockWithTime(2052, 12, 20, 0, 0)
        assertTrue(ValidityPeriodUtil.isOnOrBeforeToday(ValidityPeriodUtil.daysSinceEpochToDate(30304), clock))
    }

    @Test
    fun testSanityAboutTime() {
        val epochZero = 0L
        val epochZeroDate = LocalDateTime.ofEpochSecond(epochZero, 0, ZoneOffset.UTC)

        // 50k days
        val dayCount = 50000L

        val someDayDate = LocalDateTime.ofEpochSecond(
            epochZero + dayCount * 24L * 60L * 60L,
            0,
            ZoneOffset.UTC,
        )

        val someDayDateAlternative = epochZeroDate.plusDays(dayCount)

        assertEquals(someDayDate, someDayDateAlternative)

        val zone = ZoneId.of("Europe/Berlin")

        assertEquals(ZonedDateTime.of(someDayDate, zone), ZonedDateTime.of(someDayDateAlternative, zone))
    }
}
