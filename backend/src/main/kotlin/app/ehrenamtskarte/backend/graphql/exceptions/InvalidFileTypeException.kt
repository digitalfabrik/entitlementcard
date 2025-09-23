package app.ehrenamtskarte.backend.graphql.exceptions

import app.ehrenamtskarte.backend.graphql.exceptions.GraphQLExceptionCode

class InvalidFileTypeException : GraphQLBaseException(GraphQLExceptionCode.INVALID_FILE_TYPE)
