package app.ehrenamtskarte.backend.verification

import java.time.Clock
import java.time.LocalDate
import java.time.Month
import kotlin.math.max

class DayUtil {
    companion object {
        fun isOnOrBeforeToday(maxInclusiveDay: LocalDate, clock: Clock?): Boolean {
            // not after includes the current day
            if (maxInclusiveDay.isEqual(LocalDate.of(1970, Month.JANUARY,1))){
                return false
            }
            return !LocalDate.now(clock).isAfter(maxInclusiveDay)
        }

        fun isOnOrBeforeToday(maxInclusiveDay: LocalDate): Boolean {
            return isOnOrBeforeToday(maxInclusiveDay, null)
        }

        fun daysSinceEpochToDate(day: Long): LocalDate {
            return LocalDate.of(1970, Month.JANUARY, 1).plusDays(day);
        }
    }
}
