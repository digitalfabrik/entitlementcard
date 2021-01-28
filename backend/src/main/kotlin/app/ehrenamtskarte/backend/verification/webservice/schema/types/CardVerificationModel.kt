package app.ehrenamtskarte.backend.verification.webservice.schema.types

data class CardVerificationModel(
    val hashModel: String,
    val totp: Int
)
