package app.ehrenamtskarte.backend.cards.webservice.schema.types

import app.ehrenamtskarte.backend.cards.database.CodeType

data class CardVerificationModel(
    val cardInfoHashBase64: String,
    val totp: Int?,
    val codeType: CodeType,
)
