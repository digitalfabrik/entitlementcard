package app.ehrenamtskarte.backend.graphql.exceptions

import app.ehrenamtskarte.backend.graphql.exceptions.GraphQLExceptionCode

class InvalidFileSizeException : GraphQLBaseException(GraphQLExceptionCode.INVALID_FILE_SIZE)
