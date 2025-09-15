package app.ehrenamtskarte.backend.graphql.shared.exceptions

import app.ehrenamtskarte.backend.graphql.shared.types.GraphQLExceptionCode

class InvalidPasswordResetLinkException : GraphQLBaseException(
    GraphQLExceptionCode.INVALID_PASSWORD_RESET_LINK,
)
