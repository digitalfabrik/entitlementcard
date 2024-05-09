package app.ehrenamtskarte.backend.common.utils

import java.time.Instant
import java.time.LocalDate
import java.time.ZoneId

fun dateStringToStartOfDayInstant(value: String, timezone: ZoneId): Instant {
    return LocalDate.parse(value).atStartOfDay().atZone(timezone).toInstant()
}
