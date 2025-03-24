package app.ehrenamtskarte.backend.exception.webservice.exceptions

import app.ehrenamtskarte.backend.cards.database.CodeType
import app.ehrenamtskarte.backend.exception.GraphQLBaseException
import app.ehrenamtskarte.backend.exception.webservice.schema.GraphQLExceptionCode

class InvalidQrCodeSize(encodedCardInfoBase64: String, codeType: CodeType) : GraphQLBaseException(
    GraphQLExceptionCode.INVALID_QR_CODE_SIZE,
    mapOf(
        "encodedCardInfoBase64" to encodedCardInfoBase64,
        "codeType" to codeType,
    ),
)
