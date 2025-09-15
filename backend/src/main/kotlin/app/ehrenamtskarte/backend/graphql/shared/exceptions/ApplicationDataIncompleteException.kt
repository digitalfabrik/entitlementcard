package app.ehrenamtskarte.backend.graphql.shared.exceptions

import app.ehrenamtskarte.backend.graphql.shared.types.GraphQLExceptionCode

class ApplicationDataIncompleteException : GraphQLBaseException(
    GraphQLExceptionCode.APPLICATION_DATA_INCOMPLETE,
)
