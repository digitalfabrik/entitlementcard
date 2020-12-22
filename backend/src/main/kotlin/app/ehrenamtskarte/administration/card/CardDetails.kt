package app.ehrenamtskarte.administration.card

import java.time.LocalDate

data class CardDetails(val firstName: String,
                       val lastName: String,
                       val expirationDate: LocalDate,
                       val requestTimeMs: Long)