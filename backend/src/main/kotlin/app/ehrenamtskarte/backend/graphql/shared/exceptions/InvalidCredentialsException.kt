package app.ehrenamtskarte.backend.graphql.shared.exceptions

import app.ehrenamtskarte.backend.exception.webservice.schema.GraphQLExceptionCode

class InvalidCredentialsException : GraphQLBaseException(GraphQLExceptionCode.INVALID_CREDENTIALS)
