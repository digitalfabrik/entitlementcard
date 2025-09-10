package app.ehrenamtskarte.backend.graphql.cards.types

import java.time.Instant

data class CardVerificationResultModel(
    val valid: Boolean,
    val extendable: Boolean = false,
    val verificationTimeStamp: String = Instant.now().toString(),
)
