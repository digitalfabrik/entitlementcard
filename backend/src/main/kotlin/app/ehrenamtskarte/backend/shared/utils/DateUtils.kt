package app.ehrenamtskarte.backend.shared.utils

import java.time.Instant
import java.time.LocalDate
import java.time.ZoneId

fun dateStringToStartOfDayInstant(value: String, timezone: ZoneId): Instant =
    LocalDate.parse(value).atStartOfDay().atZone(timezone).toInstant()

fun dateStringToEndOfDayInstant(value: String, timezone: ZoneId): Instant =
    LocalDate.parse(value).plusDays(1).atStartOfDay().atZone(timezone).toInstant()
