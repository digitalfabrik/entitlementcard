package app.ehrenamtskarte.backend.graphql.shared.exceptions

import app.ehrenamtskarte.backend.graphql.shared.schema.GraphQLExceptionCode

class InvalidCodeTypeException : GraphQLBaseException(GraphQLExceptionCode.INVALID_CODE_TYPE)
