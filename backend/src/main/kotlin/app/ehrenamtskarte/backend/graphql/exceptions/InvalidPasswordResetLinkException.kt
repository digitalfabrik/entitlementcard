package app.ehrenamtskarte.backend.graphql.exceptions

import app.ehrenamtskarte.backend.graphql.exceptions.GraphQLExceptionCode

class InvalidPasswordResetLinkException : GraphQLBaseException(
    GraphQLExceptionCode.INVALID_PASSWORD_RESET_LINK,
)
