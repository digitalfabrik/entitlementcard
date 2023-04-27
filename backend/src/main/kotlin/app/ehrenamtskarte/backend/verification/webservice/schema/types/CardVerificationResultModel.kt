package app.ehrenamtskarte.backend.verification.webservice.schema.types

import java.time.Instant

data class CardVerificationResultModel(
    val valid: Boolean,
    val verificationTimeStamp: String = Instant.now().toString()
)
