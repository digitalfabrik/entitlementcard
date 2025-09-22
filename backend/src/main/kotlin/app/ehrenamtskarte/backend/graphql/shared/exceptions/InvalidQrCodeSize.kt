package app.ehrenamtskarte.backend.graphql.shared.exceptions

import app.ehrenamtskarte.backend.db.entities.CodeType
import app.ehrenamtskarte.backend.graphql.shared.types.GraphQLExceptionCode

class InvalidQrCodeSize(encodedCardInfoBase64: String, codeType: CodeType) : GraphQLBaseException(
    GraphQLExceptionCode.INVALID_QR_CODE_SIZE,
    mapOf(
        "encodedCardInfoBase64" to encodedCardInfoBase64,
        "codeType" to codeType,
    ),
)
