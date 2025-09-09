package app.ehrenamtskarte.backend.graphql.shared.exceptions

import app.ehrenamtskarte.backend.exception.webservice.schema.GraphQLExceptionCode

class InvalidPasswordResetLinkException : GraphQLBaseException(
    GraphQLExceptionCode.INVALID_PASSWORD_RESET_LINK,
)
