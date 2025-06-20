package app.ehrenamtskarte.backend.exception.webservice.exceptions

import app.ehrenamtskarte.backend.exception.GraphQLBaseException
import app.ehrenamtskarte.backend.exception.webservice.schema.GraphQLExceptionCode

class ApplicationDataIncompleteException : GraphQLBaseException(
    GraphQLExceptionCode.APPLICATION_DATA_INCOMPLETE,
)
