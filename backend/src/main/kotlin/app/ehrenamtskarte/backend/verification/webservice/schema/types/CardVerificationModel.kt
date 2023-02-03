package app.ehrenamtskarte.backend.verification.webservice.schema.types

import app.ehrenamtskarte.backend.verification.database.CodeType

data class CardVerificationModel(
    val cardInfoHashBase64: String,
    val totp: Int?,
    val codeType: CodeType
)
