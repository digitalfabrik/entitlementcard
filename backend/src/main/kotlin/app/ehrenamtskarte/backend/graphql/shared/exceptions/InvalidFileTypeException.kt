package app.ehrenamtskarte.backend.graphql.shared.exceptions

import app.ehrenamtskarte.backend.exception.webservice.schema.GraphQLExceptionCode

class InvalidFileTypeException : GraphQLBaseException(GraphQLExceptionCode.INVALID_FILE_TYPE)
