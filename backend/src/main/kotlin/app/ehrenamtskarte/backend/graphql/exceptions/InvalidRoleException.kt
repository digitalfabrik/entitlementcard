package app.ehrenamtskarte.backend.graphql.exceptions

import app.ehrenamtskarte.backend.graphql.exceptions.GraphQLExceptionCode

class InvalidRoleException : GraphQLBaseException(GraphQLExceptionCode.INVALID_ROLE)
