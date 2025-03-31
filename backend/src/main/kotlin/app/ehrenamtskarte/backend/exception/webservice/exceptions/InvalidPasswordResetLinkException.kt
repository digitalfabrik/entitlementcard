package app.ehrenamtskarte.backend.exception.webservice.exceptions

import app.ehrenamtskarte.backend.exception.GraphQLBaseException
import app.ehrenamtskarte.backend.exception.webservice.schema.GraphQLExceptionCode

class InvalidPasswordResetLinkException : GraphQLBaseException(
    GraphQLExceptionCode.INVALID_PASSWORD_RESET_LINK,
)
