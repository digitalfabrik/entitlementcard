package app.ehrenamtskarte.backend.cards.webservice.schema.types

import app.ehrenamtskarte.backend.db.entities.CodeType

data class CardVerificationModel(
    val cardInfoHashBase64: String,
    val totp: Int?,
    val codeType: CodeType,
)
