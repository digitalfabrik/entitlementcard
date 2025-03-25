package app.ehrenamtskarte.backend.exception.webservice.exceptions

import app.ehrenamtskarte.backend.exception.GraphQLBaseException
import app.ehrenamtskarte.backend.exception.webservice.schema.GraphQLExceptionCode

class PasswordResetKeyExpiredException : GraphQLBaseException(
    GraphQLExceptionCode.PASSWORD_RESET_KEY_EXPIRED,
)
