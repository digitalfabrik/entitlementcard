package app.ehrenamtskarte.backend.verification.webservice.schema.types

data class CardVerificationModel(
    val hashModelBase64: String,
    val totp: Int
)
