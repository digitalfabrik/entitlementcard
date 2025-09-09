package app.ehrenamtskarte.backend.graphql.shared.exceptions

import app.ehrenamtskarte.backend.graphql.shared.schema.GraphQLExceptionCode

class InvalidFileTypeException : GraphQLBaseException(GraphQLExceptionCode.INVALID_FILE_TYPE)
