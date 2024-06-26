package app.ehrenamtskarte.backend.common.utils

import java.time.Instant
import java.time.LocalDate
import java.time.ZoneId
import java.time.format.DateTimeFormatter

fun dateStringToStartOfDayInstant(value: String, timezone: ZoneId): Instant {
    return LocalDate.parse(value).atStartOfDay().atZone(timezone).toInstant()
}

fun dateStringToStartOfDayInstant(value: String, pattern: String, timezone: ZoneId): Instant {
    val formatter = DateTimeFormatter.ofPattern(pattern)
    return LocalDate.parse(value, formatter).atStartOfDay().atZone(timezone).toInstant()
}

fun dateStringToEndOfDayInstant(value: String, timezone: ZoneId): Instant {
    return LocalDate.parse(value).plusDays(1).atStartOfDay().atZone(timezone).toInstant()
}
