package app.ehrenamtskarte.backend.graphql.shared.exceptions

import app.ehrenamtskarte.backend.graphql.shared.schema.GraphQLExceptionCode

class InvalidRoleException : GraphQLBaseException(GraphQLExceptionCode.INVALID_ROLE)
