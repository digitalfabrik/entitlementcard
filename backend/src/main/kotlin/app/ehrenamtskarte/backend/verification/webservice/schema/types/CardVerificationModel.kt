package app.ehrenamtskarte.backend.verification.webservice.schema.types

data class CardVerificationModel(
    val cardDetailsHashBase64: String,
    val totp: Int
)
