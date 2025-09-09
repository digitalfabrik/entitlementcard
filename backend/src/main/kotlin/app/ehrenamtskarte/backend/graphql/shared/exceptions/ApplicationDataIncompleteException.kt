package app.ehrenamtskarte.backend.graphql.shared.exceptions

import app.ehrenamtskarte.backend.exception.webservice.schema.GraphQLExceptionCode

class ApplicationDataIncompleteException : GraphQLBaseException(
    GraphQLExceptionCode.APPLICATION_DATA_INCOMPLETE,
)
