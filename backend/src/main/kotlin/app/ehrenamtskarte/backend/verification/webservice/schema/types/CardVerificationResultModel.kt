package app.ehrenamtskarte.backend.verification.webservice.schema.types

data class CardVerificationResultModel(
    val valid: Boolean,
    val verificationTimeStamp: String
)
