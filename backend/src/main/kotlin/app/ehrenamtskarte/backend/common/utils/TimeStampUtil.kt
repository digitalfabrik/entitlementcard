package app.ehrenamtskarte.backend.common.utils

import java.sql.Timestamp
import java.time.LocalDate

fun convertDateStringToTimestamp(value: String): Timestamp {
    return Timestamp.valueOf(LocalDate.parse(value).atStartOfDay())
}
