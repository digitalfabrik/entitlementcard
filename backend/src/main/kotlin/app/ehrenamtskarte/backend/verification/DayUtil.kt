package app.ehrenamtskarte.backend.verification

import java.time.LocalDateTime
import java.time.ZoneOffset
import java.time.temporal.ChronoUnit

class DayUtil {
    companion object {
        fun isOnOrBeforeToday(maxInclusiveDay: LocalDateTime): Boolean {
            // FIXME: verify this and write unit test
            return !maxInclusiveDay.isAfter(LocalDateTime.now().truncatedTo(ChronoUnit.DAYS))
        }
        
        fun dateToDaysSinceEpoch(date: LocalDateTime): Long {
            return date.toEpochSecond(ZoneOffset.UTC) / 24 / 60 / 60 
        }

        fun daysSinceEpochToDate(day: Long): LocalDateTime {
            return LocalDateTime.ofEpochSecond(
                day * 24L * 60L * 60L, // FIXME: this is not correct as a day is not always 24h :D
                0,
                ZoneOffset.UTC
            )
        }
    }
}
