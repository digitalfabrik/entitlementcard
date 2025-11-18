package app.ehrenamtskarte.backend.graphql.exceptions

import app.ehrenamtskarte.backend.graphql.shared.types.GraphQLExceptionCode

open class InvalidPasswordException : GraphQLBaseException(GraphQLExceptionCode.INVALID_PASSWORD)
