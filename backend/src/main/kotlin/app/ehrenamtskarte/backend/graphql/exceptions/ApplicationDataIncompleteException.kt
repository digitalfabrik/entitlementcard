package app.ehrenamtskarte.backend.graphql.exceptions

import app.ehrenamtskarte.backend.graphql.exceptions.GraphQLExceptionCode

class ApplicationDataIncompleteException : GraphQLBaseException(
    GraphQLExceptionCode.APPLICATION_DATA_INCOMPLETE,
)
