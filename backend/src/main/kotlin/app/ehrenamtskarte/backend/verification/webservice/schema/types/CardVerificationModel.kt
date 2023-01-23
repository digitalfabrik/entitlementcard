package app.ehrenamtskarte.backend.verification.webservice.schema.types

data class CardVerificationModel(
    val cardInfoHashBase64: String,
    val totp: Int?
)
