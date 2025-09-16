package app.ehrenamtskarte.backend.graphql.shared.exceptions

import app.ehrenamtskarte.backend.graphql.shared.types.GraphQLExceptionCode

class InvalidCredentialsException : GraphQLBaseException(GraphQLExceptionCode.INVALID_CREDENTIALS)
