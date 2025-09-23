package app.ehrenamtskarte.backend.graphql.exceptions

import app.ehrenamtskarte.backend.graphql.exceptions.GraphQLExceptionCode

class InvalidCodeTypeException : GraphQLBaseException(GraphQLExceptionCode.INVALID_CODE_TYPE)
