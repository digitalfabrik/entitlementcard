package app.ehrenamtskarte.backend.graphql.shared.exceptions

import app.ehrenamtskarte.backend.graphql.shared.schema.GraphQLExceptionCode

open class InvalidPasswordException : GraphQLBaseException(GraphQLExceptionCode.INVALID_PASSWORD)
