package app.ehrenamtskarte.backend.graphql.shared.exceptions

import app.ehrenamtskarte.backend.graphql.shared.types.GraphQLExceptionCode

class PasswordResetKeyExpiredException : GraphQLBaseException(
    GraphQLExceptionCode.PASSWORD_RESET_KEY_EXPIRED,
)
