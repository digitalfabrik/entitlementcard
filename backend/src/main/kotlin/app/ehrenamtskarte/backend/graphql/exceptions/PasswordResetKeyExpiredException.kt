package app.ehrenamtskarte.backend.graphql.exceptions

import app.ehrenamtskarte.backend.graphql.exceptions.GraphQLExceptionCode

class PasswordResetKeyExpiredException : GraphQLBaseException(
    GraphQLExceptionCode.PASSWORD_RESET_KEY_EXPIRED,
)
