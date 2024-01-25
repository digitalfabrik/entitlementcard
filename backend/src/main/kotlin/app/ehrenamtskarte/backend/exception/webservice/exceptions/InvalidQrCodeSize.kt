package app.ehrenamtskarte.backend.exception.webservice.exceptions

import app.ehrenamtskarte.backend.exception.GraphQLBaseException
import app.ehrenamtskarte.backend.exception.webservice.schema.GraphQLExceptionCode
import app.ehrenamtskarte.backend.verification.database.CodeType
import graphql.GraphqlErrorException

class InvalidQrCodeSize(encodedCardInfoBase64: String, codeType: CodeType) : GraphqlErrorException(
    newErrorException().extensions(
       mapOf(
           "code" to GraphQLExceptionCode.INVALID_QR_CODE_SIZE,
           "encodedCardInfoBase64" to encodedCardInfoBase64,
           "codeType" to codeType
       )
    )
)
