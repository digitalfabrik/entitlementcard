package app.ehrenamtskarte.backend.graphql.exceptions

import app.ehrenamtskarte.backend.graphql.shared.types.GraphQLExceptionCode

class InvalidApplicationStatusException : GraphQLBaseException(
    GraphQLExceptionCode.INVALID_APPLICATION_STATUS,
)
