package app.ehrenamtskarte.backend.graphql.shared.exceptions

import app.ehrenamtskarte.backend.exception.webservice.schema.GraphQLExceptionCode

open class InvalidPasswordException : GraphQLBaseException(GraphQLExceptionCode.INVALID_PASSWORD)
