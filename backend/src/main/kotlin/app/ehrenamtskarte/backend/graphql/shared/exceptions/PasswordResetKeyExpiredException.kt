package app.ehrenamtskarte.backend.graphql.shared.exceptions

import app.ehrenamtskarte.backend.exception.webservice.schema.GraphQLExceptionCode

class PasswordResetKeyExpiredException : GraphQLBaseException(
    GraphQLExceptionCode.PASSWORD_RESET_KEY_EXPIRED,
)
