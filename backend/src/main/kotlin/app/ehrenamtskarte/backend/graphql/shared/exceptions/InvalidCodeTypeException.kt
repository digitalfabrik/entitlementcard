package app.ehrenamtskarte.backend.graphql.shared.exceptions

import app.ehrenamtskarte.backend.exception.webservice.schema.GraphQLExceptionCode

class InvalidCodeTypeException : GraphQLBaseException(GraphQLExceptionCode.INVALID_CODE_TYPE)
