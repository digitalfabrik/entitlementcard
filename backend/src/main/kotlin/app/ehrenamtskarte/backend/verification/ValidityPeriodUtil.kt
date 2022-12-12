package app.ehrenamtskarte.backend.verification

import java.time.Clock
import java.time.LocalDate
import java.time.Month
import java.time.ZoneId

class ValidityPeriodUtil {
    companion object {
        fun isOnOrBeforeToday(maxInclusiveDay: LocalDate, clock: Clock): Boolean {
            // Cards issues for day == 0 are never valid!
            if (maxInclusiveDay.isEqual(LocalDate.of(1970, Month.JANUARY, 1))) {
                return false
            }
            // not after includes the current day
            return !LocalDate.now(clock).isAfter(maxInclusiveDay)
        }

        fun isOnOrBeforeToday(maxInclusiveDay: LocalDate, timezone: ZoneId): Boolean {
            return isOnOrBeforeToday(maxInclusiveDay, Clock.system(timezone))
        }

        fun daysSinceEpochToDate(days: Long): LocalDate {
            return LocalDate.of(1970, Month.JANUARY, 1).plusDays(days)
        }
    }
}
