package app.ehrenamtskarte.backend.graphql.shared.exceptions

import app.ehrenamtskarte.backend.exception.webservice.schema.GraphQLExceptionCode

class InvalidFileSizeException : GraphQLBaseException(GraphQLExceptionCode.INVALID_FILE_SIZE)
